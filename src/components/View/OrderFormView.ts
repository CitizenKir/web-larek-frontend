import { TOrderStage } from "../../types";
import { IModalView, ModalView } from './ModalView';
import { IEvents } from '../base/events';

export interface IOrderFormView extends IModalView {
    stage: TOrderStage;
    render(): HTMLElement;
}
export class OrderFormView extends ModalView implements IOrderFormView {
    stage: TOrderStage = 'address';

    constructor(template: HTMLTemplateElement, events: IEvents) {
        super(template, events);
    }

    render(): HTMLElement {

    }
}
