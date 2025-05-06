import { IProductItem } from "../../types";

export interface IProductModel extends IProductItem {
    badgeColor: string;
    inBasket(): boolean;
} 