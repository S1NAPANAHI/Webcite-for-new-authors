import { Tables } from './database.types';
export type Product = Tables<'products'> & {
    prices?: Tables<'prices'>[];
};
