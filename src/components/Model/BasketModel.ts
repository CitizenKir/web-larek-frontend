import { IBasketData, IProductItem, TBasketItem } from '../../types';

export interface IBasketModel extends IBasketData {
    addItem(item: IProductItem): void;
    removeItem(id: string): void;
    clearBasket(): void;
}

export class BasketModel implements IBasketModel {
    items: TBasketItem[] = [];

    get total (): number {
        return this.items.reduce((sum, item) => sum + item.price, 0);
    }

    get count (): number {
        return this.items.length
    }

    addItem(item: TBasketItem): void {

    }

    removeItem(id: string): void {

    }

    clearBasket(): void {
        this.items = [];
    }
}
