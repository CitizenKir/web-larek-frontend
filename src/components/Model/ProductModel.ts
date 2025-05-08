import { IProductItem, TBasketItem } from '../../types';
import { BasketModel } from './BasketModel';

export interface IProductModel extends IProductItem {
    badgeColor: string;
    inBasket(): boolean;
}

export class ProductModel implements  IProductModel {
    readonly id: string;
    readonly title: string;
    readonly description: string;
    readonly category: string;
    readonly image: string;
    readonly price: number;
    constructor(
      productData: IProductItem,
      private basket: BasketModel
    ) {
        this.id = productData.id;
        this.title = productData.title;
        this.description = productData.description;
        this.category = productData.category;
        this.image = productData.image;
        this.price = productData.price;
    }

    get badgeColor(): string {
        return
    }

    inBasket(): boolean {

    }
}
