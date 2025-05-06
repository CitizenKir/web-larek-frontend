import { IProductItem } from "../../types";

export interface ICatalogView { 
    render(items: IProductItem): HTMLElement
}
