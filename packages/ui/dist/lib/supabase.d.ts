export { supabase } from '@zoroaster/shared';
export declare const getStorageFileUrl: (bucket: string, filePath: string) => string;
export declare const uploadFile: (bucket: string, filePath: string, file: File, options?: {}) => Promise<{
    publicUrl: string;
    id: string;
    path: string;
    fullPath: string;
}>;
export declare const deleteFile: (bucket: string, filePath: string) => Promise<import('@supabase/storage-js').FileObject[]>;
//# sourceMappingURL=supabase.d.ts.map