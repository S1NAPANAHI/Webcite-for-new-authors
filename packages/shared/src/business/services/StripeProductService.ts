import Stripe from 'stripe';
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../../database.types';
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

interface CreateProductRequest {
  name: string;
  description?: string;
  product_type: Database['public']['Enums']['product_type'];
  category_id?: string;
  images?: string[];
  work_id?: string;
  content_grants?: any[];
  track_inventory?: boolean;
  active?: boolean;
  variants: CreateVariantRequest[];
}

interface CreateVariantRequest {
  name?: string;
  sku?: string;
  unit_amount: number;
  currency?: string;
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
        description: request.description || undefined,
        images: request.images || [],
        metadata: {
          created_via: 'zoroasterverse_admin',
          created_by: createdBy,
          product_type: request.product_type
        }
      });

      // Create product in Supabase using the atomic function
      const { data: createResult, error: createError } = await this.supabase
        .rpc('create_product_with_variants', {
          p_product_data: {
            name: request.name,
            description: request.description,
            product_type: request.product_type,
            category_id: request.category_id,
            images: request.images || [],
            track_inventory: request.track_inventory || false,
            active: request.active !== false,
            work_id: request.work_id,
            content_grants: request.content_grants || []
          },
          p_variants_data: request.variants as any
        });

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
            currency: variant.currency || 'usd',
            unit_amount: variant.unit_amount,
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
            unit_amount: variant.unit_amount
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
      const { data: product, error: productError } = await this.supabase
        .from('products')
        .select('*')
        .eq('id', request.product_id)
        .single();

      if (productError || !product) {
        throw new ResourceNotFoundError('Product', request.product_id);
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
      await this.supabase
        .from('products')
        .update({
          stripe_product_id: request.stripe_product_id,
          name: stripeProduct.name, // Sync name from Stripe
          description: stripeProduct.description || product.description,
          images: stripeProduct.images || product.images,
          active: stripeProduct.active && product.active,
          updated_at: new Date().toISOString()
        })
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
      const { data: variant, error: variantError } = await this.supabase
        .from('product_variants')
        .select('*, products!inner(*)')
        .eq('id', request.variant_id)
        .single();

      if (variantError || !variant) {
        throw new ResourceNotFoundError('Product variant', request.variant_id);
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
          unit_amount: stripePrice.unit_amount || variant.unit_amount,
          currency: stripePrice.currency,
          recurring_interval: stripePrice.recurring?.interval || null,
          recurring_interval_count: stripePrice.recurring?.interval_count || null,
          active: stripePrice.active && variant.active,
          updated_at: new Date().toISOString()
        })
        .eq('id', request.variant_id);

      return {
        variant_id: request.variant_id,
        stripe_price_id: request.stripe_price_id,
        unit_amount: stripePrice.unit_amount,
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
            currency: price.currency,
            unit_amount: price.unit_amount || 0,
            recurring_interval: price.recurring?.interval || null,
            recurring_interval_count: price.recurring?.interval_count || null,
            active: price.active,
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
        })
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
          created: created_after ? { gte: created_after } : undefined
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
          created: created_after ? { gte: created_after } : undefined,
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
      // Check if product already exists
      const { data: existingProduct } = await this.supabase
        .from('products')
        .select('id')
        .eq('stripe_product_id', stripeProduct.id)
        .single();

      const productData: ProductInsert = {
        name: stripeProduct.name,
        description: stripeProduct.description || null,
        images: stripeProduct.images || [],
        active: stripeProduct.active,
        stripe_product_id: stripeProduct.id,
        slug: this.generateSlug(stripeProduct.name),
        // Extract product type from metadata or default to single_issue
        product_type: (stripeProduct.metadata?.product_type as any) || 'single_issue'
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
      // Get the product for this price
      const productId = typeof stripePrice.product === 'string' 
        ? stripePrice.product 
        : stripePrice.product?.id;

      if (!productId) {
        throw new Error('Price has no associated product');
      }

      // Find the local product
      const { data: localProduct } = await this.supabase
        .from('products')
        .select('id')
        .eq('stripe_product_id', productId)
        .single();

      if (!localProduct) {
        console.warn(`Local product not found for Stripe product ${productId}, skipping price sync`);
        return;
      }

      // Check if variant already exists for this price
      const { data: existingVariant } = await this.supabase
        .from('product_variants')
        .select('id')
        .eq('stripe_price_id', stripePrice.id)
        .single();

      const variantData: VariantInsert = {
        product_id: localProduct.id,
        stripe_price_id: stripePrice.id,
        name: stripePrice.nickname || 'Standard',
        currency: stripePrice.currency,
        unit_amount: stripePrice.unit_amount || 0,
        recurring_interval: stripePrice.recurring?.interval || null,
        recurring_interval_count: stripePrice.recurring?.interval_count || null,
        active: stripePrice.active
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
        .select('stripe_product_id, name, description, images')
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
          images: updates.images || product.images,
          ...updates
        }
      );

      // Sync back to Supabase
      await this.supabase
        .from('products')
        .update({
          name: updatedProduct.name,
          description: updatedProduct.description,
          images: updatedProduct.images || [],
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
          unit_amount: newPrice.unit_amount || 0,
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
    quantityChange: number,
    reason: string,
    referenceType?: string,
    referenceId?: string,
    userId?: string
  ) {
    try {
      const { data, error } = await this.supabase
        .rpc('update_inventory', {
          p_variant_id: variantId,
          p_quantity_change: quantityChange,
          p_movement_type: quantityChange > 0 ? 'in' : 'out',
          p_reason: reason,
          p_reference_type: referenceType,
          p_reference_id: referenceId,
          p_user_id: userId
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
        `)
        .eq('variant_id', variantId)
        .order('created_at', { ascending: false })
        .limit(limit);

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
