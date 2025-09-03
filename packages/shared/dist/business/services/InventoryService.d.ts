import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../../database.types';
interface StockAdjustmentRequest {
    variant_id: string;
    quantity_change: number;
    reason: string;
    notes?: string;
}
interface BulkStockUpdate {
    variant_id: string;
    new_quantity: number;
    reason: string;
}
interface RestockRequest {
    variant_id: string;
    quantity: number;
    supplier?: string;
    cost_per_unit?: number;
    notes?: string;
}
interface InventoryAlert {
    id: string;
    variant_id: string;
    product_name: string;
    variant_name: string;
    current_quantity: number;
    threshold: number;
    alert_type: 'low_stock' | 'out_of_stock';
    severity: 'warning' | 'critical';
}
export declare class InventoryService {
    private supabase;
    constructor(supabase: SupabaseClient<Database>);
    /**
     * Get current inventory levels with filtering and sorting
     */
    getInventoryLevels(filters?: {
        product_id?: string;
        category_id?: string;
        low_stock_only?: boolean;
        track_inventory_only?: boolean;
        search?: string;
        limit?: number;
        offset?: number;
    }): Promise<any[]>;
    /**
     * Get inventory alerts (low stock, out of stock)
     */
    getInventoryAlerts(): Promise<InventoryAlert[]>;
    /**
     * Adjust inventory quantity (manual adjustment)
     */
    adjustInventory(request: StockAdjustmentRequest, userId: string): Promise<{
        success: boolean;
        variant_id: string;
        previous_quantity: any;
        new_quantity: any;
        change: number;
    }>;
    /**
     * Bulk update inventory levels
     */
    bulkUpdateInventory(updates: BulkStockUpdate[], userId: string): Promise<{
        success: boolean;
        results: any[];
        errors: any[];
        total_processed: number;
        successful: number;
        failed: number;
    }>;
    /**
     * Restock inventory (add new stock)
     */
    restockInventory(request: RestockRequest, userId: string): Promise<{
        success: boolean;
        variant_id: string;
        quantity_added: number;
        supplier: string;
        total_cost: number;
    }>;
    /**
     * Get inventory movement history
     */
    getInventoryMovements(variantId?: string, filters?: {
        movement_type?: string;
        reference_type?: string;
        start_date?: string;
        end_date?: string;
        limit?: number;
        offset?: number;
    }): Promise<ResultOne[]>;
    /**
     * Get inventory analytics
     */
    getInventoryAnalytics(startDate?: string, endDate?: string): Promise<{
        summary: {
            total_variants: number;
            total_stock_value: number;
            healthy_stock_items: number;
            low_stock_items: number;
            out_of_stock_items: number;
            stock_health_percentage: number;
        };
        movements: {
            total_movements: number;
            stock_in: any;
            stock_out: number;
            net_movement: number;
            adjustments: number;
            turnover_rate: number;
        };
        top_moving_items: {
            quantity: number;
            value: number;
            variant_id: string;
        }[];
        date_range: {
            start: string;
            end: string;
        };
    }>;
    /**
     * Set low stock thresholds for variants
     */
    setLowStockThresholds(updates: {
        variant_id: string;
        threshold: number;
    }[]): Promise<{
        success: boolean;
        results: any[];
        errors: any[];
        total_processed: number;
    }>;
    /**
     * Generate inventory report
     */
    generateInventoryReport(format?: 'summary' | 'detailed'): Promise<{
        generated_at: string;
        format: "summary" | "detailed";
        summary: {
            total_variants: number;
            total_stock_value: number;
            healthy_stock_items: number;
            low_stock_items: number;
            out_of_stock_items: number;
            stock_health_percentage: number;
        };
        alerts: {
            total: number;
            critical: number;
            warnings: number;
            items: InventoryAlert[];
        };
        stock_movements: {
            total_movements: number;
            stock_in: any;
            stock_out: number;
            net_movement: number;
            adjustments: number;
            turnover_rate: number;
        };
        recommendations: string[];
    }>;
    /**
     * Calculate stock status
     */
    private calculateStockStatus;
    /**
     * Estimate days of stock remaining (simplified calculation)
     */
    private estimateDaysOfStock;
    /**
     * Generate inventory recommendations
     */
    private generateInventoryRecommendations;
}
export {};
