import { IProductItem } from "../../types";
import { IEvents } from '../base/events';

export interface IProductView {
    render(item: IProductItem): HTMLElement
}

export class ProductView implements IProductView {

    constructor(
      private template: HTMLTemplateElement, private events: IEvents
    ) {}

    render(item: IProductItem): HTMLElement {

    }
}
