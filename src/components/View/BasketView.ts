import { TBasketItem } from "../../types";
import { IModalView, ModalView } from "./ModalView";
import { IEvents } from '../base/events';

export interface IBasketView extends IModalView {
    render(items: TBasketItem[]): HTMLElement
}

export class BasketView extends ModalView implements IModalView {
    constructor(protected template: HTMLTemplateElement, protected events: IEvents) {
        super(template, events);
    }

    render(items: TBasketItem[]): HTMLElement {

    }
}
