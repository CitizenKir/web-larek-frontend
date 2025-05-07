import { TBasketItem } from "../../types";
import { IModalView } from "./ModalView";
import { IEvents } from '../base/events';

export interface IBasketView extends IModalView {
    render(items: TBasketItem[]): HTMLElement
}

export class BasketView {
    constructor(private template: HTMLTemplateElement, private events: IEvents) {}

    render(items: TBasketItem[]): HTMLElement {

    }
}
