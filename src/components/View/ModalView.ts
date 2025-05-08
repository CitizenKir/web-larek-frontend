import { IEvents } from '../base/events';

export interface IModalView {
    open(): void;
    close(): void;
}

export class ModalView implements IModalView {

    constructor(
      protected template: HTMLTemplateElement,
      protected events: IEvents
    ) {}

    open(): void {
    }

    close(): void {
    }


}
