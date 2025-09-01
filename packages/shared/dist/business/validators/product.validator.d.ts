import { z } from 'zod';
export declare const ProductSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodString>;
    name: z.ZodString;
    description: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    product_type: z.ZodDefault<z.ZodEnum<{
        single_issue: "single_issue";
        bundle: "bundle";
        chapter_pass: "chapter_pass";
        arc_pass: "arc_pass";
    }>>;
    active: z.ZodDefault<z.ZodBoolean>;
    work_id: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    content_grants: z.ZodNullable<z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>>;
    created_at: z.ZodOptional<z.ZodString>;
    updated_at: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const PriceSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodString>;
    product_id: z.ZodString;
    currency: z.ZodString;
    unit_amount: z.ZodNumber;
    interval: z.ZodNullable<z.ZodOptional<z.ZodEnum<{
        one_time: "one_time";
        month: "month";
        year: "year";
    }>>>;
    nickname: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    trial_days: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
    active: z.ZodDefault<z.ZodBoolean>;
    created_at: z.ZodOptional<z.ZodString>;
    updated_at: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const CreateProductSchema: z.ZodObject<{
    work_id: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    product_type: z.ZodDefault<z.ZodEnum<{
        single_issue: "single_issue";
        bundle: "bundle";
        chapter_pass: "chapter_pass";
        arc_pass: "arc_pass";
    }>>;
    active: z.ZodDefault<z.ZodBoolean>;
    description: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    name: z.ZodString;
    content_grants: z.ZodNullable<z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>>;
    prices: z.ZodArray<z.ZodObject<{
        active: z.ZodDefault<z.ZodBoolean>;
        currency: z.ZodString;
        interval: z.ZodNullable<z.ZodOptional<z.ZodEnum<{
            one_time: "one_time";
            month: "month";
            year: "year";
        }>>>;
        nickname: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        trial_days: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
        unit_amount: z.ZodNumber;
    }, z.core.$strip>>;
}, z.core.$strip>;
export declare const UpdateProductSchema: z.ZodObject<{
    work_id: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    product_type: z.ZodOptional<z.ZodDefault<z.ZodEnum<{
        single_issue: "single_issue";
        bundle: "bundle";
        chapter_pass: "chapter_pass";
        arc_pass: "arc_pass";
    }>>>;
    active: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
    updated_at: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    description: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    name: z.ZodOptional<z.ZodString>;
    content_grants: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>>>;
}, z.core.$strip>;
export declare const ProductQuerySchema: z.ZodObject<{
    active: z.ZodOptional<z.ZodEnum<{
        true: "true";
        false: "false";
    }>>;
    product_type: z.ZodOptional<z.ZodEnum<{
        single_issue: "single_issue";
        bundle: "bundle";
        chapter_pass: "chapter_pass";
        arc_pass: "arc_pass";
    }>>;
    limit: z.ZodDefault<z.ZodPipe<z.ZodString, z.ZodTransform<number, string>>>;
    offset: z.ZodDefault<z.ZodPipe<z.ZodString, z.ZodTransform<number, string>>>;
    search: z.ZodOptional<z.ZodString>;
    sort_by: z.ZodDefault<z.ZodEnum<{
        created_at: "created_at";
        updated_at: "updated_at";
        name: "name";
        price: "price";
    }>>;
    sort_order: z.ZodDefault<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
}, z.core.$strip>;
export declare const validateProductBusinessRules: (product: z.infer<typeof ProductSchema>) => {
    isValid: boolean;
    errors: string[];
};
export declare const validatePriceBusinessRules: (price: z.infer<typeof PriceSchema>) => {
    isValid: boolean;
    errors: string[];
};
export type ProductInput = z.infer<typeof ProductSchema>;
export type CreateProductInput = z.infer<typeof CreateProductSchema>;
export type UpdateProductInput = z.infer<typeof UpdateProductSchema>;
export type ProductQuery = z.infer<typeof ProductQuerySchema>;
export type PriceInput = z.infer<typeof PriceSchema>;
