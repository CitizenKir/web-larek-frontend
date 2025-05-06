import { IProductItem } from "../../types";

export interface ICatalogModel {
    getCatalogItems(): IProductItem[];
}