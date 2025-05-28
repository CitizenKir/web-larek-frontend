import { IBasketData, IProductItem, TBasketItem } from '../../types';

export interface IBasketModel extends IBasketData {
    addItem(item: IProductItem): void;
    removeItem(id: string): void;
    clearBasket(): void;
}

export class BasketModel implements IBasketModel {
    items: TBasketItem[];

    constructor() {
        this.items = []
    }

    get total (): number {
        return this.items.reduce((sum, item) => sum + item.price, 0);
    }

    get count (): number {
        return this.items.length 
    }

    addItem(item: TBasketItem): void {
        this.items.push(item)
    }

    removeItem(id: string): void {
        this.items = this.items.filter(item => item.id !== id)
    }

    clearBasket(): void {
        this.items = [];
    }
}
