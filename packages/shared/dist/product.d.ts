import { Tables } from './database.types';
export type Product = Tables<'products'> & {
    prices?: Tables<'prices'>[];
};
//# sourceMappingURL=product.d.ts.map