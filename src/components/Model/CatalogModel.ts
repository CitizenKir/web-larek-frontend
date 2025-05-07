import { IProductItem } from "../../types";
import { ApiRequestModel } from './ApiRequestModel';

export interface ICatalogModel {
    getCatalogItems(): Promise<IProductItem[]>
}

export class CatalogModel implements ICatalogModel {
    private items: IProductItem[] = [];

    constructor(private api: ApiRequestModel) {}

    async getCatalogItems(): Promise<IProductItem[]> {

    }
}
