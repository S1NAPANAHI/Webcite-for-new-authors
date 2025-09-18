import express from 'express';
import { ProductService } from '../business/services/ProductService';
import { authenticate, authorize, sanitizeInput, addRequestId, securityHeaders, authorizeResourceOwnership } from '../business/middleware/auth';
import { validateRequest, validateBusinessRules, asyncHandler, sendSuccess, sendPaginatedResponse, errorHandler } from '../business/middleware/errorHandler';
import { ProductQuerySchema, CreateProductSchema, UpdateProductSchema, validateProductBusinessRules } from '../business/validators/product.validator';
export default (supabase) => {
    const router = express.Router();
    const productService = new ProductService(supabase);
    // Apply common middleware
    router.use(addRequestId);
    router.use(securityHeaders);
    router.use(sanitizeInput);
    router.use(express.json({ limit: '10mb' }));
    /**
     * GET /api/products
     * Get all products with filtering, pagination, and search
     */
    router.get('/', validateRequest(ProductQuerySchema, 'query'), asyncHandler(async (_req, res) => {
        const result = await productService.getProducts(_req.query);
        return sendPaginatedResponse(res, result.products, result.pagination, 'Products retrieved successfully');
    }));
    /**
     * GET /api/products/:id
     * Get a specific product by ID
     */
    router.get('/:id', asyncHandler(async (req, res) => {
        const product = await productService.getProductById(req.params.id);
        return sendSuccess(res, { product }, 'Product retrieved successfully');
    }));
    /**
     * GET /api/products/type/:productType
     * Get products by type (single_issue, bundle, chapter_pass, arc_pass)
     */
    router.get('/type/:productType', asyncHandler(async (req, res) => {
        const { productType } = req.params;
        const { active = 'true' } = req.query;
        const products = await productService.getProductsByType(productType, active === 'true');
        return sendSuccess(res, { products }, `${productType} products retrieved successfully`);
    }));
    /**
     * GET /api/products/:id/analytics
     * Get product analytics (admin only)
     */
    router.get('/:id/analytics', authenticate(supabase), authorize(['admin', 'super_admin', 'accountant']), asyncHandler(async (req, res) => {
        const { start_date, end_date } = req.query;
        const analytics = await productService.getProductAnalytics(req.params.id, start_date, end_date);
        return sendSuccess(res, { analytics }, 'Product analytics retrieved successfully');
    }));
    /**
     * GET /api/products/user/:userId/recommendations
     * Get recommended products for a user
     */
    router.get('/user/:userId/recommendations', authenticate(supabase), authorizeResourceOwnership('userId'), asyncHandler(async (req, res) => {
        const { limit = 6 } = req.query;
        const products = await productService.getRecommendedProducts(req.params.userId, parseInt(limit));
        return sendSuccess(res, { products }, 'Recommended products retrieved successfully');
    }));
    /**
     * POST /api/products
     * Create a new product (admin only)
     */
    router.post('/', authenticate(supabase), authorize(['admin', 'super_admin']), validateRequest(CreateProductSchema), validateBusinessRules(validateProductBusinessRules), asyncHandler(async (req, res) => {
        const product = await productService.createProduct(req.body, req.user.id);
        return sendSuccess(res, { product }, 'Product created successfully', 201);
    }));
    /**
     * PUT /api/products/:id
     * Update an existing product (admin only)
     */
    router.put('/:id', authenticate(supabase), authorize(['admin', 'super_admin']), validateRequest(UpdateProductSchema), asyncHandler(async (req, res) => {
        const product = await productService.updateProduct(req.params.id, req.body, req.user.id);
        return sendSuccess(res, { product }, 'Product updated successfully');
    }));
    /**
     * DELETE /api/products/:id
     * Soft delete a product (admin only)
     */
    router.delete('/:id', authenticate(supabase), authorize(['admin', 'super_admin']), asyncHandler(async (req, res) => {
        const product = await productService.deleteProduct(req.params.id, req.user.id);
        return sendSuccess(res, { product }, 'Product deleted successfully');
    }));
    /**
     * POST /api/products/:id/access-check
     * Check if user has access to a product
     */
    router.post('/:id/access-check', authenticate(supabase), asyncHandler(async (req, res) => {
        const hasAccess = await productService.validateProductAccess(req.params.id, req.user.id);
        return sendSuccess(res, { hasAccess }, 'Access validation completed');
    }));
    // Error handling middleware (should be last)
    router.use(errorHandler);
    return router;
};
//# sourceMappingURL=products.enhanced.js.map