import { SupabaseClient } from '@supabase/supabase-js';
import { 
  CreateProductInput, 
  UpdateProductInput, 
  ProductQuery,
  CreateProductSchema,
  UpdateProductSchema,
  ProductQuerySchema,
  validateProductBusinessRules,
  validatePriceBusinessRules
} from '../validators/product.validator';
import { 
  ResourceNotFoundError, 
  ValidationError, 
  BusinessRuleError,
  DatabaseError 
} from '../errors';




export class ProductService {
  constructor(private supabase: SupabaseClient) {}

  /**
   * Get all products with optional filtering
   */
  async getProducts(query: ProductQuery) {
    try {
      // Validate query parameters
      const validatedQuery = ProductQuerySchema.parse(query);

      let supabaseQuery = this.supabase
        .from('products')
        .select(`
          id, name, description, product_type, active, work_id, content_grants, created_at, updated_at,
          prices:prices(id, currency, unit_amount, interval, nickname, trial_days, active)
        `);

      // Apply filters
      if (validatedQuery.active !== undefined) {
        supabaseQuery = supabaseQuery.eq('active', validatedQuery.active === 'true');
      }

      if (validatedQuery.product_type) {
        supabaseQuery = supabaseQuery.eq('product_type', validatedQuery.product_type);
      }

      if (validatedQuery.search) {
        supabaseQuery = supabaseQuery.or(
          `name.ilike.%${validatedQuery.search}%,description.ilike.%${validatedQuery.search}%`
        );
      }

      // Apply sorting
      const ascending = validatedQuery.sort_order === 'asc';
      supabaseQuery = supabaseQuery.order(validatedQuery.sort_by, { ascending });

      // Apply pagination
      supabaseQuery = supabaseQuery.range(
        validatedQuery.offset,
        validatedQuery.offset + validatedQuery.limit - 1
      );

      const { data: products, error, count } = await supabaseQuery;

      if (error) {
        throw new DatabaseError('Failed to fetch products', { supabaseError: error });
      }

      return {
        products: products || [],
        pagination: {
          limit: validatedQuery.limit,
          offset: validatedQuery.offset,
          total: count || 0
        }
      };
    } catch (error) {
      if (error instanceof ValidationError || error instanceof DatabaseError) {
        throw error;
      }
      throw new DatabaseError('Unexpected error while fetching products');
    }
  }

  /**
   * Get a product by ID
   */
  async getProductById(id: string) {
    try {
      const { data: product, error } = await this.supabase
        .from('products')
        .select(`
          id, name, description, product_type, active, work_id, content_grants, created_at, updated_at,
          prices:prices(id, currency, unit_amount, interval, nickname, trial_days, active),
          work:works(id, title, description, type, status)
        `)
        .eq('id', id)
        .single();

      if (error && error.code === 'PGRST116') {
        throw new ResourceNotFoundError('Product', id);
      }

      if (error) {
        throw new DatabaseError('Failed to fetch product', { supabaseError: error });
      }

      return product;
    } catch (error) {
      if (error instanceof ResourceNotFoundError || error instanceof DatabaseError) {
        throw error;
      }
      throw new DatabaseError('Unexpected error while fetching product');
    }
  }

  /**
   * Create a new product with prices
   */
  async createProduct(input: CreateProductInput, _createdBy: string) {
    try {
      // Validate input
      const validatedInput = CreateProductSchema.parse(input);

      // Validate business rules
      const productValidation = validateProductBusinessRules(validatedInput);
      if (!productValidation.isValid) {
        throw new BusinessRuleError('Product validation failed', {
          violations: productValidation.errors
        });
      }

      // Validate each price
      for (const price of validatedInput.prices) {
        const priceValidation = validatePriceBusinessRules({
          ...price,
          product_id: '', // Will be set after product creation
          id: undefined
        });
        if (!priceValidation.isValid) {
          throw new BusinessRuleError('Price validation failed', {
            violations: priceValidation.errors
          });
        }
      }

      // Check if work exists if work_id is provided
      if (validatedInput.work_id) {
        const { data: work, error: workError } = await this.supabase
          .from('works')
          .select('id, status')
          .eq('id', validatedInput.work_id)
          .single();

        if (workError || !work) {
          throw new BusinessRuleError('Associated work not found or invalid');
        }

        if (work.status !== 'published') {
          throw new BusinessRuleError('Can only create products for published works');
        }
      }

      // Create product in transaction
      const { data: product, error: productError } = await this.supabase
        .from('products')
        .insert({
          name: validatedInput.name,
          description: validatedInput.description,
          product_type: validatedInput.product_type,
          active: validatedInput.active,
          work_id: validatedInput.work_id,
          content_grants: validatedInput.content_grants
        })
        .select()
        .single();

      if (productError) {
        throw new DatabaseError('Failed to create product', { supabaseError: productError });
      }

      // Create prices
      const pricesData = validatedInput.prices.map(price => ({
        ...price,
        product_id: product.id
      }));

      const { data: prices, error: pricesError } = await this.supabase
        .from('prices')
        .insert(pricesData)
        .select();

      if (pricesError) {
        // Rollback product creation
        await this.supabase.from('products').delete().eq('id', product.id);
        throw new DatabaseError('Failed to create prices', { supabaseError: pricesError });
      }

      return {
        ...product,
        prices
      };
    } catch (error) {
      if (error instanceof ValidationError || error instanceof BusinessRuleError || error instanceof DatabaseError) {
        throw error;
      }
      throw new DatabaseError('Unexpected error while creating product');
    }
  }

  /**
   * Update an existing product
   */
    async updateProduct(id: string, input: UpdateProductInput, _updatedBy: string) {
    try {
      // Check if product exists
      const existingProduct = await this.getProductById(id);

      // Validate input
      const validatedInput = UpdateProductSchema.parse(input);

      // Validate business rules if provided
      if (Object.keys(validatedInput).length > 0) {
        const mergedProduct = { ...existingProduct, ...validatedInput };
        const productValidation = validateProductBusinessRules(mergedProduct);
        if (!productValidation.isValid) {
          throw new BusinessRuleError('Product validation failed', {
            violations: productValidation.errors
          });
        }
      }

      // Check work status if work_id is being updated
      if (validatedInput.work_id) {
        const { data: work, error: workError } = await this.supabase
          .from('works')
          .select('id, status')
          .eq('id', validatedInput.work_id)
          .single();

        if (workError || !work) {
          throw new BusinessRuleError('Associated work not found or invalid');
        }

        if (work.status !== 'published') {
          throw new BusinessRuleError('Can only associate products with published works');
        }
      }

      const { data: product, error } = await this.supabase
        .from('products')
        .update({
          ...validatedInput,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select(`
          id, name, description, product_type, active, work_id, content_grants, created_at, updated_at,
          prices:prices(id, currency, unit_amount, interval, nickname, trial_days, active)
        `)
        .single();

      if (error) {
        throw new DatabaseError('Failed to update product', { supabaseError: error });
      }

      return product;
    } catch (error) {
      if (error instanceof ResourceNotFoundError || error instanceof ValidationError || 
          error instanceof BusinessRuleError || error instanceof DatabaseError) {
        throw error;
      }
      throw new DatabaseError('Unexpected error while updating product');
    }
  }

  /**
   * Delete a product (soft delete by setting active = false)
   */
  async deleteProduct(id: string, _deletedBy: string) {
    try {
      // Check if product exists
      await this.getProductById(id);

      // Check if product has active subscriptions
      const { data: activeSubscriptions, error: subscriptionError } = await this.supabase
        .from('subscriptions')
        .select('id')
        .eq('plan_id', id)
        .eq('status', 'active')
        .limit(1);

      if (subscriptionError) {
        throw new DatabaseError('Failed to check active subscriptions');
      }

      if (activeSubscriptions && activeSubscriptions.length > 0) {
        throw new BusinessRuleError('Cannot delete product with active subscriptions');
      }

      // Soft delete (set active = false)
      const { data: product, error } = await this.supabase
        .from('products')
        .update({ 
          active: false,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new DatabaseError('Failed to delete product', { supabaseError: error });
      }

      // Also deactivate associated prices
      await this.supabase
        .from('prices')
        .update({ active: false })
        .eq('product_id', id);

      return product;
    } catch (error) {
      if (error instanceof ResourceNotFoundError || error instanceof BusinessRuleError || 
          error instanceof DatabaseError) {
        throw error;
      }
      throw new DatabaseError('Unexpected error while deleting product');
    }
  }

  /**
   * Get products by type with business logic
   */
  async getProductsByType(productType: string, activeOnly: boolean = true) {
    try {
      let query = this.supabase
        .from('products')
        .select(`
          id, name, description, product_type, active, work_id, content_grants, created_at, updated_at,
          prices:prices!inner(id, currency, unit_amount, interval, nickname, trial_days, active)
        `)
        .eq('product_type', productType);

      if (activeOnly) {
        query = query.eq('active', true).eq('prices.active', true);
      }

      const { data: products, error } = await query;

      if (error) {
        throw new DatabaseError('Failed to fetch products by type', { supabaseError: error });
      }

      return products || [];
    } catch (error) {
      if (error instanceof DatabaseError) {
        throw error;
      }
      throw new DatabaseError('Unexpected error while fetching products by type');
    }
  }

  /**
   * Validate product access permissions
   */
  async validateProductAccess(productId: string, userId: string): Promise<boolean> {
    try {
      // Check if user has purchased the product
      const { data: purchase, error: purchaseError } = await this.supabase
        .from('purchases')
        .select('id')
        .eq('product_id', productId)
        .eq('user_id', userId)
        .eq('status', 'completed')
        .single();

      if (!purchaseError && purchase) {
        return true;
      }

      // Check if user has active subscription that grants access
      const { data: subscription, error: subscriptionError } = await this.supabase
        .from('subscriptions')
        .select('id, status')
        .eq('user_id', userId)
        .eq('status', 'active')
        .single();

      if (!subscriptionError && subscription) {
        // Additional logic to check if subscription grants access to this product
        // This would depend on your business rules for what each subscription tier includes
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error validating product access:', error);
      return false;
    }
  }

  /**
   * Get recommended products based on user's purchase history
   */
  async getRecommendedProducts(userId: string, limit: number = 6) {
    try {
      // Get user's purchase history
      const { data: purchases, error: purchaseError } = await this.supabase
        .from('purchases')
        .select('product_id, products(product_type)')
        .eq('user_id', userId)
        .eq('status', 'completed');

      if (purchaseError) {
        throw new DatabaseError('Failed to fetch user purchases', { supabaseError: purchaseError });
      }

      // Simple recommendation: suggest products of similar types
      const purchasedTypes = purchases?.map(p => (p as any).products?.product_type).filter(Boolean) || [];
      const recommendedTypes = [...new Set(purchasedTypes)];

      if (recommendedTypes.length === 0) {
        // New user - recommend featured products
        const { data: featured, error: featuredError } = await this.supabase
          .from('products')
          .select(`
            id, name, description, product_type, active, work_id, content_grants, created_at, updated_at,
            prices:prices!inner(id, currency, unit_amount, interval, nickname, trial_days, active),
            work:works(is_featured)
          `)
          .eq('active', true)
          .eq('prices.active', true)
          .eq('work.is_featured', true)
          .limit(limit);

        if (featuredError) {
          throw new DatabaseError('Failed to fetch featured products');
        }

        return featured || [];
      }

      // Get products of similar types that user hasn't purchased
      const { data: recommended, error: recommendedError } = await this.supabase
        .from('products')
        .select(`
          id, name, description, product_type, active, work_id, content_grants, created_at, updated_at,
          prices:prices!inner(id, currency, unit_amount, interval, nickname, trial_days, active)
        `)
        .eq('active', true)
        .eq('prices.active', true)
        .in('product_type', recommendedTypes)
        .not('id', 'in', `(${purchases.map(p => p.product_id).join(',')})`)
        .limit(limit);

      if (recommendedError) {
        throw new DatabaseError('Failed to fetch recommended products');
      }

      return recommended || [];
    } catch (error) {
      if (error instanceof DatabaseError) {
        throw error;
      }
      throw new DatabaseError('Unexpected error while fetching recommendations');
    }
  }

  

  /**
   * Update product availability based on work status
   */
  async updateProductAvailability(workId: string, workStatus: string) {
    try {
      const shouldBeActive = workStatus === 'published';

      const { error } = await this.supabase
        .from('products')
        .update({ 
          active: shouldBeActive,
          updated_at: new Date().toISOString()
        })
        .eq('work_id', workId);

      if (error) {
        throw new DatabaseError('Failed to update product availability', { supabaseError: error });
      }

      console.log(`Updated product availability for work ${workId}: ${shouldBeActive}`);
    } catch (error) {
      console.error('Error updating product availability:', error);
      throw error;
    }
  }

  /**
   * Calculate product metrics and analytics
   */
  async getProductAnalytics(productId: string, startDate?: string, endDate?: string) {
    try {
      // Sales metrics
      const { data: salesData, error: salesError } = await this.supabase
        .from('purchases')
        .select('amount_cents, currency, created_at')
        .eq('product_id', productId)
        .eq('status', 'completed')
        .gte('created_at', startDate || '2020-01-01')
        .lte('created_at', endDate || new Date().toISOString());

      if (salesError) {
        throw new DatabaseError('Failed to fetch sales data');
      }

      // Calculate metrics
      const totalSales = salesData?.length || 0;
      const totalRevenue = salesData?.reduce((sum, sale) => sum + sale.amount_cents, 0) || 0;
      const averageOrderValue = totalSales > 0 ? totalRevenue / totalSales : 0;

      // Reviews metrics
      const { data: reviewsData, error: reviewsError } = await this.supabase
        .from('product_reviews')
        .select('rating')
        .eq('product_id', productId);

      if (reviewsError) {
        throw new DatabaseError('Failed to fetch reviews data');
      }

      const totalReviews = reviewsData?.length || 0;
      const averageRating = totalReviews > 0 
        ? reviewsData.reduce((sum, review) => sum + review.rating, 0) / totalReviews 
        : 0;

      return {
        sales: {
          totalSales,
          totalRevenue,
          averageOrderValue
        },
        reviews: {
          totalReviews,
          averageRating: Math.round(averageRating * 10) / 10
        }
      };
    } catch (error) {
      if (error instanceof DatabaseError) {
        throw error;
      }
      throw new DatabaseError('Unexpected error while calculating analytics');
    }
  }
}
