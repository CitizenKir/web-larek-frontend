import { IProductItem } from "../../types";
import { ApiService, IApiService } from '../ApiService';

export interface ICatalogModel {
    getCatalogItems(): Promise<IProductItem[]>
}

export class CatalogModel implements ICatalogModel {
    private items: IProductItem[] = [];

    constructor(private api: IApiService) {}

    async getCatalogItems(): Promise<IProductItem[]> {

    }
}
