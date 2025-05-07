import { IProductItem } from "../../types";
import { IEvents } from '../base/events';

export interface ICatalogView {
    render(items: IProductItem[]): HTMLElement
}

export class CatalogView implements  ICatalogView {
    constructor(
      private template: HTMLTemplateElement, private events: IEvents
    ) {}

    render(items: IProductItem[]): HTMLElement {

    }
}
