import { IProductItem } from "../../types";
import { ModalView } from './ModalView';
import { IProductView } from "./ProductView";
import { IEvents } from '../base/events';

export class ProductDetailView extends ModalView implements IProductView {

	constructor(template: HTMLTemplateElement, events: IEvents) {
		super(template, events);
	}

	render(item: IProductItem): HTMLElement {

	}
}
