import { IBasketData, IProductItem } from "../../types";

export interface IBasketModel extends IBasketData {
    addItem(item: IProductItem): void;
    removeItem(id: string): void;
    clearBasket(): void;
}