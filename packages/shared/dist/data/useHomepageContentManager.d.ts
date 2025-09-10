import { TablesInsert } from '../database.types';
type HomepageContentInsert = TablesInsert<'homepage_content'>;
export declare const useHomepageContentManager: () => {
    createContent: (contentData: HomepageContentInsert) => Promise<boolean>;
    loading: boolean;
    error: string | null;
    success: boolean;
};
export {};
//# sourceMappingURL=useHomepageContentManager.d.ts.map