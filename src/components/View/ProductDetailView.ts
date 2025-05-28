import { IProductItem, TBasketItem } from '../../types';
import { IProductView, ProductView } from './ProductView';
import { IEvents } from '../base/events';
import { CategoryColors } from '../../types';
import { ProductModel } from '../Model/ProductModel';

export class ProductDetailView
	extends ProductView
	implements IProductView
{
	protected descriptionElement: HTMLElement;
	protected buttonBuyElement: HTMLButtonElement;
	private currentClickHandler: EventListener | null;

	constructor(template: HTMLTemplateElement, events: IEvents) {
		super(template, events);
		this.descriptionElement = this.element.querySelector('.card__text');
		this.buttonBuyElement = this.element.querySelector('.button');
		this.currentClickHandler = null;
	}

	render(item: ProductModel, inBasket = false): HTMLElement {
		if (this.currentClickHandler) {
			this.buttonBuyElement.removeEventListener(
				'click',
				this.currentClickHandler
			);
		}
		this.currentClickHandler = () => {
			if (inBasket) {
				this.events.emit('product:remove-from-basket-in-card', item);
			} else {
				this.events.emit('product:add-to-basket', item);
			}
		};

		this.buttonBuyElement.addEventListener('click', this.currentClickHandler);

		this.buttonBuyElement.textContent = inBasket
			? 'Убрать из корзины'
			: 'В корзину';

		this.categoryElement.textContent = item.category;
		this.categoryElement.classList.value = 'card__category';
		this.categoryElement.classList.add(
			`card__category_${
				CategoryColors[item.category as keyof typeof CategoryColors]
			}`
		);
		this.titleElement.textContent = item.title;
		this.imageElement.src = this.buildImageUri(item.image);
		this.priceElement.textContent = this.setPrice(item.price);
		this.descriptionElement.textContent = item.description;

		return this.element;
	}
}
