import { CategoryEntity } from "../entities/category.entity";


export interface ResponseAllCategorys{
    page: number;
    lastPage: number;
    total: number;
    limit: number;
    data: CategoryEntity[];
}