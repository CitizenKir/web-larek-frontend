import { IProductItem } from "../../types";

export interface IProductView {
    render(item: IProductItem): HTMLElement
}