import Stripe from 'stripe';
import { ResourceNotFoundError, ValidationError, BusinessRuleError, DatabaseError } from '../errors';
export class StripeProductService {
    constructor(supabase, stripeSecretKey) {
        this.supabase = supabase;
        this.stripe = new Stripe(stripeSecretKey, {
            apiVersion: '2023-10-16'
        });
    }
    async createProductWithStripe(request, createdBy) {
        try {
            if (!request.name || !request.variants || request.variants.length === 0) {
                throw new ValidationError('Product name and at least one variant required');
            }
            const stripeProductParams = {
                name: request.name,
                images: request.cover_image_url ? [request.cover_image_url] : [],
                metadata: {
                    created_via: 'zoroaster-api',
                    created_by: createdBy,
                    product_type: request.product_type,
                },
            };
            if (request.description) {
                stripeProductParams.description = request.description;
            }
            const stripeProduct = await this.stripe.products.create(stripeProductParams);
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
                p_variants_data: request.variants
            });
            if (createError || !createResult) {
                await this.stripe.products.del(stripeProduct.id);
                throw new DatabaseError('Failed to create product in database', { supabaseError: createError });
            }
            const productId = createResult.product_id;
            const variantIds = createResult.variant_ids;
            await this.supabase
                .from('products')
                .update({ stripe_product_id: stripeProduct.id })
                .eq('id', productId);
            const stripeResults = await Promise.all(request.variants.map(async (variant, index) => {
                const variantId = variantIds[index];
                const priceData = {
                    product: stripeProduct.id,
                    currency: variant.price_currency || 'usd',
                    unit_amount_decimal: Math.round(variant.price_amount).toString(),
                    ...(variant.sku ? { lookup_key: variant.sku } : {}),
                    metadata: {
                        supabase_variant_id: variantId,
                        sku: variant.sku || '',
                        variant_name: variant.name || 'Standard'
                    }
                };
                if (variant.recurring_interval) {
                    priceData.recurring = {
                        interval: variant.recurring_interval,
                        interval_count: variant.recurring_interval_count || 1
                    };
                }
                const stripePrice = await this.stripe.prices.create(priceData);
                await this.supabase
                    .from('product_variants')
                    .update({ stripe_price_id: stripePrice.id })
                    .eq('id', variantId);
                return {
                    variant_id: variantId,
                    stripe_price_id: stripePrice.id,
                    price_amount: variant.price_amount
                };
            }));
            return {
                product_id: productId,
                stripe_product_id: stripeProduct.id,
                variants: stripeResults
            };
        }
        catch (error) {
            console.error('Error creating product with Stripe:', error);
            if (error instanceof ValidationError || error instanceof DatabaseError) {
                throw error;
            }
            throw new DatabaseError('Unexpected error creating product with Stripe');
        }
    }
    async attachStripeProduct(request) {
        try {
            const stripeProduct = await this.stripe.products.retrieve(request.stripe_product_id);
            if (!stripeProduct) {
                throw new ValidationError('Stripe product not found');
            }
            const { data, error: productError } = await this.supabase
                .from('products')
                .select('*')
                .eq('id', request.product_id);
            let product = null;
            if (productError || !data || data.length === 0) {
                throw new ResourceNotFoundError('Product', request.product_id);
            }
            else {
                product = data[0];
            }
            const { data: existingLink } = await this.supabase
                .from('products')
                .select('id, name')
                .eq('stripe_product_id', request.stripe_product_id)
                .single();
            if (existingLink && existingLink.id !== request.product_id) {
                throw new BusinessRuleError(`Stripe product ${request.stripe_product_id} is already linked to product: ${existingLink.name}`);
            }
            const updateData = {
                stripe_product_id: request.stripe_product_id,
                name: stripeProduct.name,
                description: stripeProduct.description || (product ? product.description : null) || null,
                active: !!(stripeProduct.active && (product ? product.active : false)),
                updated_at: new Date().toISOString(),
                ...(stripeProduct.images && stripeProduct.images.length > 0 ? {
                    cover_image_url: stripeProduct.images[0]
                } : {})
            };
            await this.supabase
                .from('products')
                .update(updateData)
                .eq('id', request.product_id);
            if (request.sync_variants) {
                await this.syncStripeVariants(request.stripe_product_id, request.product_id);
            }
            return {
                product_id: request.product_id,
                stripe_product_id: request.stripe_product_id,
                synced_at: new Date().toISOString()
            };
        }
        catch (error) {
            console.error('Error attaching Stripe product:', error);
            if (error instanceof ValidationError || error instanceof ResourceNotFoundError ||
                error instanceof BusinessRuleError) {
                throw error;
            }
            throw new DatabaseError('Unexpected error attaching Stripe product');
        }
    }
    async attachStripePrice(request) {
        try {
            const stripePrice = await this.stripe.prices.retrieve(request.stripe_price_id);
            if (!stripePrice) {
                throw new ValidationError('Stripe price not found');
            }
            const { data, error: variantError } = await this.supabase
                .from('product_variants')
                .select('id, price_amount, price_currency, recurring_interval, recurring_interval_count, is_active, products!inner(stripe_product_id, name)')
                .eq('id', request.variant_id);
            let variant;
            if (variantError || !data || data.length === 0) {
                throw new ResourceNotFoundError('Product variant', request.variant_id);
            }
            else {
                variant = data[0];
            }
            const { data: existingLink } = await this.supabase
                .from('product_variants')
                .select('id, name, products!inner(name)')
                .eq('stripe_price_id', request.stripe_price_id)
                .single();
            if (existingLink && existingLink.id !== request.variant_id) {
                throw new BusinessRuleError(`Stripe price ${request.stripe_price_id} is already linked to variant: ${existingLink.name} (${existingLink.products.name})`);
            }
            const productStripeId = variant.products.stripe_product_id;
            if (productStripeId && stripePrice.product !== productStripeId) {
                throw new BusinessRuleError('Stripe price does not belong to the linked Stripe product');
            }
            await this.supabase
                .from('product_variants')
                .update({
                stripe_price_id: request.stripe_price_id,
                price_amount: stripePrice.unit_amount || variant.price_amount,
                price_currency: stripePrice.currency,
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
        }
        catch (error) {
            console.error('Error attaching Stripe price:', error);
            if (error instanceof ValidationError || error instanceof ResourceNotFoundError ||
                error instanceof BusinessRuleError) {
                throw error;
            }
            throw new DatabaseError('Unexpected error attaching Stripe price');
        }
    }
    async syncStripeVariants(stripeProductId, productId) {
        try {
            const prices = await this.stripe.prices.list({
                product: stripeProductId,
                limit: 100
            });
            for (const price of prices.data) {
                const { data: existingVariant } = await this.supabase
                    .from('product_variants')
                    .select('id')
                    .eq('stripe_price_id', price.id)
                    .single();
                if (!existingVariant) {
                    const variantData = {
                        product_id: productId,
                        stripe_price_id: price.id,
                        name: price.nickname || 'Standard',
                        price_currency: price.currency,
                        price_amount: price.unit_amount || 0,
                        is_active: price.active,
                        is_default: prices.data.indexOf(price) === 0
                    };
                    await this.supabase.from('product_variants').insert(variantData);
                }
            }
        }
        catch (error) {
            console.error('Error syncing Stripe variants:', error);
            throw error;
        }
    }
    async importFromStripe(options = {}) {
        try {
            const { limit = 100, created_after, active_only = true, default_category_id } = options;
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
                    }
                    catch (error) {
                        console.error(`Failed to sync product ${stripeProduct.id}:`, error);
                        itemsFailed++;
                    }
                }
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
                    }
                    catch (error) {
                        console.error(`Failed to sync price ${price.id}:`, error);
                        itemsFailed++;
                    }
                }
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
            }
            catch (error) {
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
        }
        catch (error) {
            console.error('Stripe import error:', error);
            throw new DatabaseError('Failed to import from Stripe');
        }
    }
    async syncProductFromStripe(stripeProduct, _defaultCategoryId) {
        try {
            const { data: existingProduct } = await this.supabase
                .from('products')
                .select('*')
                .eq('stripe_product_id', stripeProduct.id)
                .single(); // @ts-ignore
            const productData = {
                name: stripeProduct.name,
                description: stripeProduct.description || null,
                product_type: stripeProduct.metadata?.['product_type'] || 'single_issue',
                active: stripeProduct.active,
                is_subscription: stripeProduct.metadata?.['subscription'] === 'true',
                is_bundle: stripeProduct.metadata?.['bundle'] === 'true',
                is_premium: stripeProduct.metadata?.['premium'] !== 'false',
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
                await this.supabase
                    .from('products')
                    .update({
                    ...productData,
                    updated_at: new Date().toISOString()
                })
                    .eq('id', existingProduct.id);
            }
            else {
                await this.supabase
                    .from('products')
                    .insert(productData);
            }
        }
        catch (error) {
            console.error(`Error syncing product ${stripeProduct.id}:`, error);
            throw error;
        }
    }
    async syncPriceFromStripe(stripePrice) {
        try {
            const { data: product, error: _productError } = await this.supabase
                .from('products')
                .select('*')
                .eq('stripe_product_id', stripePrice.product.id)
                .single();
            if (!product) {
                console.warn(`Local product not found for Stripe product ${stripePrice.product}, skipping price sync`);
                return;
            }
            const { data: existingVariant } = await this.supabase
                .from('product_variants')
                .select('id')
                .eq('stripe_price_id', stripePrice.id)
                .single();
            const variantData = {
                product_id: product.id,
                stripe_price_id: stripePrice.id,
                name: stripePrice.nickname || `Default Variant`,
                price_amount: stripePrice.unit_amount || 0,
                price_currency: stripePrice.currency,
                is_active: stripePrice.active,
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
                position: 1,
                metadata: {
                    type: 'stripe'
                },
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
                await this.supabase
                    .from('product_variants')
                    .update({
                    ...variantData,
                    updated_at: new Date().toISOString()
                })
                    .eq('id', existingVariant.id);
            }
            else {
                await this.supabase
                    .from('product_variants')
                    .insert(variantData);
            }
        }
        catch (error) {
            console.error(`Error syncing price ${stripePrice.id}:`, error);
            throw error;
        }
    }
    async updateStripeProduct(productId, updates) {
        try {
            const { data: product, error } = await this.supabase
                .from('products')
                .select('stripe_product_id, name, description, cover_image_url')
                .eq('id', productId)
                .single();
            if (error || !product?.stripe_product_id) {
                throw new ResourceNotFoundError('Product or Stripe product ID', productId);
            }
            const updatedProduct = await this.stripe.products.update(product.stripe_product_id, {
                name: updates.name || product.name,
                description: updates.description || product.description,
                images: product.cover_image_url ? [product.cover_image_url] : [],
                ...updates
            });
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
        }
        catch (error) {
            console.error('Error updating Stripe product:', error);
            throw new DatabaseError('Failed to update Stripe product');
        }
    }
    async createNewPrice(variantId, priceData) {
        try {
            const { data: variant, error } = await this.supabase
                .from('product_variants')
                .select(`
          id,
          stripe_price_id,
          products!inner(stripe_product_id, name)
        `)
                .eq('id', variantId)
                .single();
            if (error || !variant || !variant.products || !variant.products.stripe_product_id) {
                throw new ResourceNotFoundError('Variant or linked Stripe product', variantId);
            }
            const newPrice = await this.stripe.prices.create({
                ...priceData,
                product: variant.products.stripe_product_id,
                metadata: {
                    ...priceData.metadata,
                    supabase_variant_id: variantId,
                    replaced_price_id: variant.stripe_price_id
                }
            });
            if (variant.stripe_price_id) {
                await this.stripe.prices.update(variant.stripe_price_id, {
                    active: false
                });
            }
            await this.supabase
                .from('product_variants')
                .update({
                stripe_price_id: newPrice.id,
                price_amount: newPrice.unit_amount || 0,
                price_currency: newPrice.currency,
                recurring_interval: newPrice.recurring?.interval || null,
                recurring_interval_count: newPrice.recurring?.interval_count || null,
                updated_at: new Date().toISOString()
            })
                .eq('id', variantId);
            return newPrice;
        }
        catch (error) {
            console.error('Error creating new price:', error);
            throw new DatabaseError('Failed to create new price');
        }
    }
    async getProductCatalog(filters = {}) {
        try {
            const { category_id: _category_id, active_only = true, with_variants = true, limit = 50, offset = 0 } = filters;
            let query = this.supabase
                .from('products')
                .select(`*`);
            if (active_only) {
                query = query.eq('active', true);
            }
            const { data: products, error } = await query
                .order('created_at', { ascending: false })
                .range(offset, offset + limit - 1);
            if (error) {
                throw new DatabaseError('Failed to fetch product catalog', { supabaseError: error });
            }
            if (!with_variants || !products || products.length === 0) {
                return products || [];
            }
            const productIds = products.map(p => p.id);
            const { data: variants, error: variantsError } = await this.supabase
                .from('product_variants')
                .select('*')
                .in('product_id', productIds)
                .eq('is_active', true)
                .order('is_default', { ascending: false })
                .order('price_amount', { ascending: true });
            if (variantsError) {
                throw new DatabaseError('Failed to fetch product variants');
            }
            const variantsByProduct = (variants || []).reduce((acc, variant) => {
                if (!acc[variant.product_id]) {
                    acc[variant.product_id] = [];
                }
                acc[variant.product_id].push(variant);
                return acc;
            }, {});
            return products.map(product => ({
                ...product,
                variants: variantsByProduct[product.id] || []
            }));
        }
        catch (error) {
            console.error('Error fetching product catalog:', error);
            if (error instanceof DatabaseError) {
                throw error;
            }
            throw new DatabaseError('Unexpected error fetching product catalog');
        }
    }
    async getLowStockAlerts() {
        try {
            const { data: lowStockVariants, error } = await this.supabase
                .from('product_variants')
                .select(`
          id, name, sku, inventory_quantity,
          products!inner(id, name, active)
        `)
                .eq('is_active', true)
                .eq('products.active', true)
                .not('inventory_quantity', 'is', null)
                .lte('inventory_quantity', 10);
            if (error) {
                throw new DatabaseError('Failed to fetch low stock alerts');
            }
            return lowStockVariants || [];
        }
        catch (error) {
            console.error('Error getting low stock alerts:', error);
            throw new DatabaseError('Failed to get low stock alerts');
        }
    }
    async updateInventory(variantId, quantityChange) {
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
        }
        catch (error) {
            console.error('Error updating inventory:', error);
            if (error instanceof DatabaseError) {
                throw error;
            }
            throw new DatabaseError('Unexpected error updating inventory');
        }
    }
    async getInventoryMovements(variantId, limit = 50) {
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
        }
        catch (error) {
            console.error('Error fetching inventory movements:', error);
            throw new DatabaseError('Failed to fetch inventory movements');
        }
    }
    generateSlug(text) {
        return text
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();
    }
    async validateStripeIntegration(productId) {
        try {
            const { data: product, error } = await this.supabase
                .from('products')
                .select(`
          id, name, stripe_product_id,
          product_variants(id, name, stripe_price_id, is_active)
        `)
                .eq('id', productId)
                .single();
            if (error || !product) {
                throw new ResourceNotFoundError('Product', productId);
            }
            const issues = [];
            if (!product.stripe_product_id) {
                issues.push('Product not linked to Stripe product');
            }
            const activeVariants = (product.product_variants || []).filter(v => v.is_active);
            const variantsWithoutPrices = activeVariants.filter(v => !v.stripe_price_id);
            if (variantsWithoutPrices.length > 0) {
                issues.push(`${variantsWithoutPrices.length} active variants missing Stripe price IDs`);
            }
            if (product.stripe_product_id) {
                try {
                    await this.stripe.products.retrieve(product.stripe_product_id);
                }
                catch {
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
        }
        catch (error) {
            console.error('Error validating Stripe integration:', error);
            if (error instanceof ResourceNotFoundError) {
                throw error;
            }
            throw new DatabaseError('Failed to validate Stripe integration');
        }
    }
}
//# sourceMappingURL=StripeProductService.js.map