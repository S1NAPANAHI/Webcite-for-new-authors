import { Tables } from './database.types';

export type Product = Tables<'products'> & {
    unit_amounts?: number[];
};
