import { IProductItem, CategoryColors } from '../../types';
import { IEvents } from '../base/events';
import { cloneTemplate } from '../../utils/utils';
import { CDN_URL } from '../../utils/constants';
import { IProductModel, ProductModel } from '../Model/ProductModel';

export interface IProductView {
	render(item: IProductItem): HTMLElement;
}

export class ProductView implements IProductView {
	protected element: HTMLElement;
	protected categoryElement: HTMLElement;
	protected titleElement: HTMLElement;
	protected imageElement: HTMLImageElement;
	protected priceElement: HTMLElement;

	constructor(
		protected template: HTMLTemplateElement,
		protected events: IEvents
	) {
		this.element = cloneTemplate(this.template);
		this.categoryElement = this.element.querySelector('.card__category');
		this.titleElement = this.element.querySelector('.card__title');
		this.imageElement = this.element.querySelector('.card__image');
		this.priceElement = this.element.querySelector('.card__price');
	}

	protected buildImageUri(uri: string): string {
		return CDN_URL + uri;
	}

	protected setPrice(value: number | null): string {
		if (value === null) {
			return 'Бесценно';
		}
		return `${value} синапсов`;
	}

	render(item: ProductModel): HTMLElement {
		this.element.addEventListener('click', (event) => {
			this.events.emit('product:detail', item);
		});
		this.categoryElement.textContent = item.category;
		this.categoryElement.classList.add(
			`card__category_${item.badgeColor}`
		);
		this.titleElement.textContent = item.title;
		this.imageElement.src = this.buildImageUri(item.image);
		this.priceElement.textContent = this.setPrice(item.price);
		return this.element;
	}
}
