import Stripe from 'stripe';
import { SupabaseClient } from '@supabase/supabase-js';
import { Database, Json } from '../../database.types';
import { 
  ResourceNotFoundError, 
  ValidationError, 
  BusinessRuleError,
  DatabaseError 
} from '../errors';

type Product = Database['public']['Tables']['products']['Row'];
type ProductVariant = Database['public']['Tables']['product_variants']['Row'];
type ProductInsert = Database['public']['Tables']['products']['Insert'];
type VariantInsert = Database['public']['Tables']['product_variants']['Insert'];

interface CreateProductWithVariantsResult {
  product_id: string;
  variant_ids: string[];
}

interface CreateProductRequest {
  name: string;
  description?: string;
  product_type: Database['public']['Enums']['product_type'];
  category_id?: string;
  cover_image_url?: string | null;
  work_id?: string;
  content_grants?: any[];
  track_inventory?: boolean;
  active?: boolean;
  variants: CreateVariantRequest[];
}

interface CreateVariantRequest {
  name?: string;
  sku?: string;
  price_amount: number;
  price_currency?: string;
  recurring_interval?: 'day' | 'week' | 'month' | 'year';
  recurring_interval_count?: number;
  inventory_quantity?: number;
  attributes?: Record<string, any>;
  is_default?: boolean;
  weight?: number;
  dimensions?: Record<string, any>;
}

interface AttachStripeProductRequest {
  product_id: string;
  stripe_product_id: string;
  sync_variants?: boolean;
}

interface AttachStripePriceRequest {
  variant_id: string;
  stripe_price_id: string;
}

interface StripeSyncLog {
  id: string;
  sync_type: string;
  status: string;
  started_at: string;
  completed_at?: string | null;
  items_processed?: number | null;
  items_synced?: number | null;
  items_failed?: number | null;
  error_details?: string | null;
  result?: Json | null;
}

interface StripeSyncLogInsert {
  sync_type: string;
  status: string;
  started_at: string;
  completed_at?: string | null;
  items_processed?: number | null;
  items_synced?: number | null;
  items_failed?: number | null;
  error_details?: string | null;
  result?: Json | null;
}

interface InventoryMovement {
  id: string; // Assuming 'id' is always present
  // Add other fields from 'inventory_movements' table if needed
  created_at: string; // Assuming created_at is always present
  variant_id: string; // Assuming variant_id is always present
  quantity_change: number; // Assuming quantity_change is always present
  created_by_profile: {
    username: string | null;
    display_name: string | null;
  } | null;
}

export class StripeProductService {
  private stripe: Stripe;

  constructor(
    private supabase: SupabaseClient<Database>,
    stripeSecretKey: string
  ) {
    this.stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2023-10-16'
    });
  }

  /**
   * Create a new product with variants and sync to Stripe
   */
  async createProductWithStripe(request: CreateProductRequest, createdBy: string) {
    try {
      // Validate input
      if (!request.name || !request.variants || request.variants.length === 0) {
        throw new ValidationError('Product name and at least one variant required');
      }

      // Start by creating the Stripe product
      const stripeProduct = await this.stripe.products.create({
        name: request.name,
        description: request.description || null,
        images: request.cover_image_url ? [request.cover_image_url] : [],
        metadata: {
          created_via: 'zoroaster-api',
          created_by: createdBy,
          product_type: request.product_type,
        },
      });

      // Create product in Supabase using the atomic function
      const { data: createResult, error: createError } = await this.supabase
        .rpc('create_product_with_variants', {
          p_product_data: {
            name: request.name,
            description: request.description,
            product_type: request.product_type,
            category_id: request.category_id,
            cover_image_url: request.cover_image_url || null,
            track_inventory: request.track_inventory || false,
            active: request.active !== false,
            work_id: request.work_id,
            content_grants: request.content_grants || []
          },
          p_variants_data: request.variants as any
        }) as { data: CreateProductWithVariantsResult | null, error: any };

      if (createError || !createResult) {
        // Cleanup Stripe product on failure
        await this.stripe.products.del(stripeProduct.id);
        throw new DatabaseError('Failed to create product in database', { supabaseError: createError });
      }

      const productId = createResult.product_id;
      const variantIds = createResult.variant_ids;

      // Update product with Stripe product ID
      await this.supabase
        .from('products')
        .update({ stripe_product_id: stripeProduct.id })
        .eq('id', productId);

      // Create Stripe prices for each variant
      const stripeResults = await Promise.all(
        request.variants.map(async (variant, index) => {
          const variantId = variantIds[index];
          
          const priceData: Stripe.PriceCreateParams = {
            product: stripeProduct.id,
            currency: variant.price_currency || 'usd',
            price_amount: variant.price_amount,
            lookup_key: variant.sku || null, // Using SKU as lookup_key
            metadata: {
              supabase_variant_id: variantId,
              sku: variant.sku || '',
              variant_name: variant.name || 'Standard'
            }
          };

          // Add recurring configuration if specified
          if (variant.recurring_interval) {
            priceData.recurring = {
              interval: variant.recurring_interval,
              interval_count: variant.recurring_interval_count || 1
            };
          }

          const stripePrice = await this.stripe.prices.create(priceData);
          
          // Update variant with Stripe price ID
          await this.supabase
            .from('product_variants')
            .update({ stripe_price_id: stripePrice.id })
            .eq('id', variantId);

          return {
            variant_id: variantId,
            stripe_price_id: stripePrice.id,
            price_amount: variant.price_amount
          };
        })
      );

      return {
        product_id: productId,
        stripe_product_id: stripeProduct.id,
        variants: stripeResults
      };

    } catch (error) {
      console.error('Error creating product with Stripe:', error);
      if (error instanceof ValidationError || error instanceof DatabaseError) {
        throw error;
      }
      throw new DatabaseError('Unexpected error creating product with Stripe');
    }
  }

  /**
   * Attach existing Stripe product to Supabase product
   */
  async attachStripeProduct(request: AttachStripeProductRequest) {
    try {
      // Validate Stripe product exists and get details
      const stripeProduct = await this.stripe.products.retrieve(request.stripe_product_id);
      
      if (!stripeProduct) {
        throw new ValidationError('Stripe product not found');
      }

      // Check if product exists in Supabase
      const { data, error: productError }: { data: Product[] | null, error: any | null } = await this.supabase
        .from('products')
        .select('*')
        .eq('id', request.product_id);

      let product: Product;

      if (productError || !data || data.length === 0) {
        throw new ResourceNotFoundError('Product', request.product_id);
      } else {
        product = (data as any)[0] as Product;
      }

      // Check if Stripe product is already attached to another product
      const { data: existingLink } = await this.supabase
        .from('products')
        .select('id, name')
        .eq('stripe_product_id', request.stripe_product_id)
        .single();

      if (existingLink && existingLink.id !== request.product_id) {
        throw new BusinessRuleError(
          `Stripe product ${request.stripe_product_id} is already linked to product: ${existingLink.name}`
        );
      }

      // Update product with Stripe product ID and sync basic info
      const updateData: Partial<Database['public']['Tables']['products']['Update']> = {
        stripe_product_id: request.stripe_product_id,
        name: stripeProduct.name, // Sync name from Stripe
        description: stripeProduct.description || product.description || null,
        active: stripeProduct.active && product.active,
        updated_at: new Date().toISOString(),
        // Only update cover_image_url if we have images from Stripe
        ...(stripeProduct.images && stripeProduct.images.length > 0 ? {
          cover_image_url: stripeProduct.images[0]
        } : {})
      };

      await this.supabase
        .from('products')
        .update(updateData)
        .eq('id', request.product_id);

      // Optionally sync variants if requested
      if (request.sync_variants) {
        await this.syncStripeVariants(request.stripe_product_id, request.product_id);
      }

      return {
        product_id: request.product_id,
        stripe_product_id: request.stripe_product_id,
        synced_at: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error attaching Stripe product:', error);
      if (error instanceof ValidationError || error instanceof ResourceNotFoundError || 
          error instanceof BusinessRuleError) {
        throw error;
      }
      throw new DatabaseError('Unexpected error attaching Stripe product');
    }
  }

  /**
   * Attach existing Stripe price to variant
   */
  async attachStripePrice(request: AttachStripePriceRequest) {
    try {
      // Validate Stripe price exists
      const stripePrice = await this.stripe.prices.retrieve(request.stripe_price_id);
      
      if (!stripePrice) {
        throw new ValidationError('Stripe price not found');
      }

      // Check if variant exists
      const { data, error: variantError } = await this.supabase
        .from('product_variants')
        .select('id, price_amount, price_currency, recurring_interval, recurring_interval_count, active, products!inner(stripe_product_id, name)')
        .eq('id', request.variant_id);

      let variant: ProductVariant & { products: Product };

      if (variantError || !data || data.length === 0) {
        throw new ResourceNotFoundError('Product variant', request.variant_id);
      } else {
        variant = (data as any)[0] as ProductVariant & { products: Product };
      }

      // Check if price is already attached to another variant
      const { data: existingLink } = await this.supabase
        .from('product_variants')
        .select('id, name, products!inner(name)')
        .eq('stripe_price_id', request.stripe_price_id)
        .single();

      if (existingLink && existingLink.id !== request.variant_id) {
        throw new BusinessRuleError(
          `Stripe price ${request.stripe_price_id} is already linked to variant: ${existingLink.name} (${existingLink.products.name})`
        );
      }

      // Verify the price belongs to the correct product
      const productStripeId = variant.products.stripe_product_id;
      if (productStripeId && stripePrice.product !== productStripeId) {
        throw new BusinessRuleError(
          'Stripe price does not belong to the linked Stripe product'
        );
      }

      // Update variant with Stripe price ID and sync pricing info
      await this.supabase
        .from('product_variants')
        .update({
          stripe_price_id: request.stripe_price_id,
          price_amount: stripePrice.unit_amount || variant.price_amount,
          currency: stripePrice.currency || 'usd',
          recurring_interval: stripePrice.recurring?.interval || null,
          recurring_interval_count: stripePrice.recurring?.interval_count || null,
          is_active: stripePrice.active && variant.is_active,
          updated_at: new Date().toISOString()
        })
        .eq('id', request.variant_id);

      return {
        variant_id: request.variant_id,
        stripe_price_id: stripePrice.id,
                    price_amount: stripePrice.unit_amount || 0,
        currency: stripePrice.currency,
        synced_at: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error attaching Stripe price:', error);
      if (error instanceof ValidationError || error instanceof ResourceNotFoundError || 
          error instanceof BusinessRuleError) {
        throw error;
      }
      throw new DatabaseError('Unexpected error attaching Stripe price');
    }
  }

  /**
   * Sync Stripe variants (prices) for a product
   */
  private async syncStripeVariants(stripeProductId: string, productId: string) {
    try {
      // Get all prices for the Stripe product
      const prices = await this.stripe.prices.list({
        product: stripeProductId,
        limit: 100
      });

      for (const price of prices.data) {
        // Check if variant already exists for this price
        const { data: existingVariant } = await this.supabase
          .from('product_variants')
          .select('id')
          .eq('stripe_price_id', price.id)
          .single();

        if (!existingVariant) {
          // Create new variant
          const variantData: VariantInsert = {
            product_id: productId,
            stripe_price_id: price.id,
            name: price.nickname || 'Standard',
            currency: price.currency as string,
            price_amount: price.unit_amount || 0,
            recurring_interval: price.recurring?.interval || null,
            recurring_interval_count: price.recurring?.interval_count || null,
            is_active: price.active as boolean,
            is_default: prices.data.indexOf(price) === 0 // First price as default
          };

          await this.supabase.from('product_variants').insert(variantData);
        }
      }
    } catch (error) {
      console.error('Error syncing Stripe variants:', error);
      throw error;
    }
  }

  /**
   * Import products from Stripe catalog
   */
  async importFromStripe(options: {
    limit?: number;
    created_after?: number;
    active_only?: boolean;
    default_category_id?: string;
  } = {}) {
    try {
      const { limit = 100, created_after, active_only = true, default_category_id } = options;
      
      // Start sync log
      const { data: syncLog, error: logError } = await this.supabase
        .from('stripe_sync_logs')
        .insert({
          sync_type: 'products',
          status: 'processing',
          started_at: new Date().toISOString()
        } as Database['public']['Tables']['stripe_sync_logs']['Insert'])
        .select('id')
        .single();

      if (logError) {
        throw new DatabaseError('Failed to create sync log');
      }

      let itemsProcessed = 0;
      let itemsSynced = 0;
      let itemsFailed = 0;

      try {
        // Fetch products from Stripe
        const products = await this.stripe.products.list({
          limit,
          active: active_only,
          ...(created_after ? { created: { gte: created_after } } : {})
        });

        for (const stripeProduct of products.data) {
          try {
            itemsProcessed++;
            await this.syncProductFromStripe(stripeProduct, default_category_id);
            itemsSynced++;
          } catch (error) {
            console.error(`Failed to sync product ${stripeProduct.id}:`, error);
            itemsFailed++;
          }
        }

        // Fetch and sync prices
        const prices = await this.stripe.prices.list({
          limit,
          active: active_only,
          ...(created_after ? { created: { gte: created_after } } : {}),
          expand: ['data.product']
        });

        for (const price of prices.data) {
          try {
            if (typeof price.product === 'object' && price.product.id) {
              await this.syncPriceFromStripe(price);
            }
          } catch (error) {
            console.error(`Failed to sync price ${price.id}:`, error);
            itemsFailed++;
          }
        }

        // Update sync log with results
        await this.supabase
          .from('stripe_sync_logs')
          .update({
            status: itemsFailed > 0 ? 'partial' : 'success',
            completed_at: new Date().toISOString(),
            items_processed: itemsProcessed,
            items_synced: itemsSynced,
            items_failed: itemsFailed,
            result: {
              products_imported: products.data.length,
              prices_imported: prices.data.length
            }
          })
          .eq('id', syncLog.id);

        return {
          products_synced: itemsSynced,
          items_failed: itemsFailed,
          sync_log_id: syncLog.id
        };

      } catch (error) {
        // Update sync log with error
        await this.supabase
          .from('stripe_sync_logs')
          .update({
            status: 'error',
            completed_at: new Date().toISOString(),
            error_details: error instanceof Error ? error.message : 'Unknown error',
            items_processed: itemsProcessed,
            items_synced: itemsSynced,
            items_failed: itemsFailed
          })
          .eq('id', syncLog.id);

        throw error;
      }

    } catch (error) {
      console.error('Stripe import error:', error);
      throw new DatabaseError('Failed to import from Stripe');
    }
  }

  /**
   * Sync individual product from Stripe to Supabase
   */
  private async syncProductFromStripe(stripeProduct: Stripe.Product, defaultCategoryId?: string) {
    try {
      // Check if product already exists in our DB
      const { data: existingProduct, error: fetchError } = await this.supabase
        .from('products')
        .select('*')
        .eq('stripe_product_id', stripeProduct.id)
        .single();

      const productData: ProductInsert = {
        name: stripeProduct.name,
        description: stripeProduct.description || null,
        product_type: (stripeProduct.metadata?.product_type as Database['public']['Enums']['product_type']) || 'single_issue',
        active: stripeProduct.active,
        is_subscription: stripeProduct.metadata?.subscription === 'true',
        is_bundle: stripeProduct.metadata?.bundle === 'true',
        is_premium: stripeProduct.metadata?.premium !== 'false',
        cover_image_url: stripeProduct.images?.[0] || null,
        status: stripeProduct.active ? 'active' : 'inactive',
        stripe_product_id: stripeProduct.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        slug: this.generateSlug(stripeProduct.name),
        title: stripeProduct.name,
        file_key: null,
        published_at: stripeProduct.active ? new Date().toISOString() : null
      };

      if (existingProduct) {
        // Update existing product
        await this.supabase
          .from('products')
          .update({
            ...productData,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingProduct.id);
      } else {
        // Create new product
        await this.supabase
          .from('products')
          .insert(productData);
      }
    } catch (error) {
      console.error(`Error syncing product ${stripeProduct.id}:`, error);
      throw error;
    }
  }

  /**
   * Sync individual price from Stripe to Supabase variant
   */
  private async syncPriceFromStripe(stripePrice: Stripe.Price) {
    try {
      if (typeof stripePrice.product !== 'string') {
        throw new Error('Product ID must be a string');
      }

      // Find the product in our database
      const { data: product, error: productError } = await this.supabase
        .from('products')
        .select('*')
        .eq('stripe_product_id', stripePrice.product)
        .single();

      if (!product) {
        console.warn(`Local product not found for Stripe product ${stripePrice.product}, skipping price sync`);
        return;
      }

      // Check if variant already exists for this price
      const { data: existingVariant } = await this.supabase
        .from('product_variants')
        .select('id')
        .eq('stripe_price_id', stripePrice.id)
        .single();

      const variantData: VariantInsert = {
        product_id: product.id,
        stripe_price_id: stripePrice.id,
        name: stripePrice.nickname || `Default Variant`,
        price_amount: stripePrice.unit_amount || 0,
        price_currency: stripePrice.currency,
        active: stripePrice.active,
        is_default: true,
        sku: stripePrice.lookup_key || null,
        tax_included: stripePrice.tax_behavior === 'inclusive',
        track_inventory: false,
        requires_shipping: false,
        is_digital: true,
        inventory_policy: 'deny',
        inventory_quantity: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        available_for_sale: stripePrice.active,
        is_active: stripePrice.active,
        position: 1,
        metadata: { 
          type: 'stripe',
          recurring_interval: stripePrice.recurring?.interval,
          recurring_interval_count: stripePrice.recurring?.interval_count || 1
        } as any,
        digital_file_name: null,
        digital_file_size_bytes: null,
        digital_file_url: null,
        dimension_unit: null,
        height_cm: null,
        width_cm: null,
        depth_cm: null,
        weight_grams: null,
        weight_unit: null,
        barcode: null,
        barcode_type: null,
        compare_at_amount: null,
        cost_amount: null,
        cost_currency: null,
        description: null,
        inventory_management: null,
        low_stock_threshold: null,
        option1: null,
        option2: null,
        option3: null,
        tax_code: null
      };

      if (existingVariant) {
        // Update existing variant
        await this.supabase
          .from('product_variants')
          .update({
            ...variantData,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingVariant.id);
      } else {
        // Create new variant
        await this.supabase
          .from('product_variants')
          .insert(variantData);
      }
    } catch (error) {
      console.error(`Error syncing price ${stripePrice.id}:`, error);
      throw error;
    }
  }

  /**
   * Update Stripe product from Supabase data
   */
  async updateStripeProduct(productId: string, updates: Partial<Stripe.ProductUpdateParams>) {
    try {
      // Get current product with Stripe ID
      const { data: product, error } = await this.supabase
        .from('products')
        .select('stripe_product_id, name, description, cover_image_url')
        .eq('id', productId)
        .single();

      if (error || !product?.stripe_product_id) {
        throw new ResourceNotFoundError('Product or Stripe product ID', productId);
      }

      // Update in Stripe
      const updatedProduct = await this.stripe.products.update(
        product.stripe_product_id,
        {
          name: updates.name || product.name,
          description: updates.description || product.description,
          images: updates.cover_image_url ? [updates.cover_image_url] : (product.cover_image_url ? [product.cover_image_url] : undefined),
          ...updates
        }
      );

      // Sync back to Supabase
      await this.supabase
        .from('products')
        .update({
          name: updatedProduct.name,
          description: updatedProduct.description,
          cover_image_url: updatedProduct.images?.[0] || null,
          active: updatedProduct.active,
          updated_at: new Date().toISOString()
        })
        .eq('id', productId);

      return updatedProduct;
    } catch (error) {
      console.error('Error updating Stripe product:', error);
      throw new DatabaseError('Failed to update Stripe product');
    }
  }

  /**
   * Create new price for existing product (price versioning)
   */
  async createNewPrice(variantId: string, priceData: Omit<Stripe.PriceCreateParams, 'product'>) {
    try {
      // Get variant and product info
      const { data: variant, error } = await this.supabase
        .from('product_variants')
        .select(`
          id,
          stripe_price_id,
          products!inner(stripe_product_id, name)
        `)
        .eq('id', variantId)
        .single();

      if (error || !variant?.products?.stripe_product_id) {
        throw new ResourceNotFoundError('Variant or linked Stripe product', variantId);
      }

      // Create new price in Stripe
      const newPrice = await this.stripe.prices.create({
        ...priceData,
        product: variant.products.stripe_product_id,
        metadata: {
          ...priceData.metadata,
          supabase_variant_id: variantId,
          replaced_price_id: variant.stripe_price_id
        }
      });

      // Deactivate old price if it exists
      if (variant.stripe_price_id) {
        await this.stripe.prices.update(variant.stripe_price_id, {
          active: false
        });
      }

      // Update variant with new price ID
      await this.supabase
        .from('product_variants')
        .update({
          stripe_price_id: newPrice.id,
          price_amount: newPrice.unit_amount || 0,
          currency: newPrice.currency,
          recurring_interval: newPrice.recurring?.interval || null,
          recurring_interval_count: newPrice.recurring?.interval_count || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', variantId);

      return newPrice;
    } catch (error) {
      console.error('Error creating new price:', error);
      throw new DatabaseError('Failed to create new price');
    }
  }

  /**
   * Get complete product catalog with variants and Stripe info
   */
  async getProductCatalog(filters: {
    category_id?: string;
    active_only?: boolean;
    with_variants?: boolean;
    limit?: number;
    offset?: number;
  } = {}): Promise<any[]> {
    try {
      const { 
        category_id, 
        active_only = true, 
        with_variants = true, 
        limit = 50, 
        offset = 0 
      } = filters;

      let query = this.supabase
        .from('products')
        .select(`*`);

      if (active_only) {
        query = query.eq('active', true);
      }

      // Note: category_id field doesn't exist in products table
      // Remove this filter for now
      // if (category_id) {
      //   query = query.eq('category_id', category_id);
      // }

      const { data: products, error } = await query
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) {
        throw new DatabaseError('Failed to fetch product catalog', { supabaseError: error });
      }

      if (!with_variants || !products || products.length === 0) {
        return products || [];
      }

      // Fetch variants for each product
      const productIds = products.map(p => p.id);
      const { data: variants, error: variantsError } = await this.supabase
        .from('product_variants')
        .select('*')
        .in('product_id', productIds)
        .eq('active', true)
        .order('is_default', { ascending: false })
        .order('unit_amount', { ascending: true });

      if (variantsError) {
        throw new DatabaseError('Failed to fetch product variants');
      }

      // Group variants by product
      const variantsByProduct = (variants || []).reduce((acc, variant) => {
        if (!acc[variant.product_id]) {
          acc[variant.product_id] = [];
        }
        acc[variant.product_id].push(variant);
        return acc;
      }, {} as Record<string, any[]>);

      // Attach variants to products
      return products.map(product => ({
        ...product,
        variants: variantsByProduct[product.id] || []
      }));

    } catch (error) {
      console.error('Error fetching product catalog:', error);
      if (error instanceof DatabaseError) {
        throw error;
      }
      throw new DatabaseError('Unexpected error fetching product catalog');
    }
  }

  /**
   * Get low stock alerts
   */
  async getLowStockAlerts(): Promise<any[]> {
    try {
      const { data: lowStockVariants, error } = await this.supabase
        .from('product_variants')
        .select(`
          id, name, sku, inventory_quantity,
          products!inner(id, name, active)
        `)
        .eq('active', true)
        .eq('products.active', true)
        .not('inventory_quantity', 'is', null)
        .lte('inventory_quantity', 10); // Low stock threshold hardcoded to 10 for now

      if (error) {
        throw new DatabaseError('Failed to fetch low stock alerts');
      }

      return lowStockVariants || [];
    } catch (error) {
      console.error('Error getting low stock alerts:', error);
      throw new DatabaseError('Failed to get low stock alerts');
    }
  }

  /**
   * Update inventory levels
   */
  async updateInventory(
    variantId: string,
    quantityChange: number
  ) {
    try {
      const { data, error } = await this.supabase
        .rpc('update_inventory', {
          p_variant_id: variantId,
          p_quantity_change: quantityChange
        });

      if (error) {
        throw new DatabaseError('Failed to update inventory', { supabaseError: error });
      }

      return data;
    } catch (error) {
      console.error('Error updating inventory:', error);
      if (error instanceof DatabaseError) {
        throw error;
      }
      throw new DatabaseError('Unexpected error updating inventory');
    }
  }

  /**
   * Get inventory movements history
   */
  async getInventoryMovements(variantId: string, limit: number = 50): Promise<any[]> {
    try {
      const { data: movements, error } = await this.supabase
        .from('inventory_movements')
        .select(`
          *,
          created_by_profile:profiles!created_by(username, display_name)
        `) // Cast here
        .eq('variant_id', variantId)
        .order('created_at', { ascending: false })
        .limit(limit) as { data: InventoryMovement[] | null, error: any };

      if (error) {
        throw new DatabaseError('Failed to fetch inventory movements');
      }

      return movements || [];
    } catch (error) {
      console.error('Error fetching inventory movements:', error);
      throw new DatabaseError('Failed to fetch inventory movements');
    }
  }

  /**
   * Generate URL-safe slug from text
   */
  private generateSlug(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  /**
   * Validate product has all required Stripe mappings
   */
  async validateStripeIntegration(productId: string) {
    try {
      const { data: product, error } = await this.supabase
        .from('products')
        .select(`
          id, name, stripe_product_id,
          product_variants(id, name, stripe_price_id, active)
        `)
        .eq('id', productId)
        .single();

      if (error || !product) {
        throw new ResourceNotFoundError('Product', productId);
      }

      const issues: string[] = [];

      // Check if product has Stripe product ID
      if (!product.stripe_product_id) {
        issues.push('Product not linked to Stripe product');
      }

      // Check if variants have Stripe price IDs
      const activeVariants = product.product_variants?.filter(v => v.active) || [];
      const variantsWithoutPrices = activeVariants.filter(v => !v.stripe_price_id);
      
      if (variantsWithoutPrices.length > 0) {
        issues.push(`${variantsWithoutPrices.length} active variants missing Stripe price IDs`);
      }

      // Verify Stripe resources exist
      if (product.stripe_product_id) {
        try {
          await this.stripe.products.retrieve(product.stripe_product_id);
        } catch {
          issues.push('Linked Stripe product not found');
        }
      }

      return {
        is_valid: issues.length === 0,
        issues,
        product_name: product.name,
        stripe_product_id: product.stripe_product_id,
        variants_count: activeVariants.length,
        mapped_variants: activeVariants.length - variantsWithoutPrices.length
      };

    } catch (error) {
      console.error('Error validating Stripe integration:', error);
      if (error instanceof ResourceNotFoundError) {
        throw error;
      }
      throw new DatabaseError('Failed to validate Stripe integration');
    }
  }
}
