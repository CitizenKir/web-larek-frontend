import { IProductItem, CategoryColors } from '../../types';


export interface IProductModel extends IProductItem {
    badgeColor: string;
}

export class ProductModel implements  IProductModel {
    readonly id: string;
    readonly title: string;
    readonly description: string;
    readonly category: string;
    readonly image: string;
    readonly price: number;
    readonly badgeColor: string
    constructor(
      productData: IProductItem,
    ) {
        this.id = productData.id;
        this.title = productData.title;
        this.description = productData.description;
        this.category = productData.category;
        this.image = productData.image;
        this.price = productData.price;
        this.badgeColor = CategoryColors[productData.category as keyof typeof CategoryColors]
    }
}
