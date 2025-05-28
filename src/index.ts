import { EventEmitter } from './components/base/events';
import { ensureElement } from './utils/utils';
import './scss/styles.scss';
import { ApiService } from './components/ApiService';
import {
	IFormData,
	IOrderData,
	IProductItem,
	TBasketItem,
	TOrderItem,
} from './types';
import { ProductView } from './components/View/ProductView';
import { ModalView } from './components/View/ModalView';
import { ProductDetailView } from './components/View/ProductDetailView';
import { BasketModel } from './components/Model/BasketModel';
import { BasketView } from './components/View/BasketView';
import { OrderFormView } from './components/View/OrderFormView';
import { ProductModel } from './components/Model/ProductModel';

const events = new EventEmitter();
const api = ApiService.getInstance();
const basket = new BasketModel();

//Получение шаблонов разметки
const catalogElement = ensureElement<HTMLElement>('.gallery');
const cardTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const cardDetailTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const headerBasketElement = ensureElement<HTMLElement>('.header__basket');
const headerBasketCounterElement = ensureElement<HTMLElement>(
	'.header__basket-counter'
);
const basketElement = ensureElement<HTMLTemplateElement>('#basket');
const modalElement = ensureElement<HTMLElement>('.modal');
const orderFormStageAddressElement =
	ensureElement<HTMLTemplateElement>('#order');
const orderFormStageEmailElement =
	ensureElement<HTMLTemplateElement>('#contacts');
const orderFormStageSuccessElement =
	ensureElement<HTMLTemplateElement>('#success');

//Инициализация компонентов отображения    
const modal = new ModalView(modalElement, events);
const basketView = new BasketView(basketElement, cardBasketTemplate, events);
const cardDetailView = new ProductDetailView(cardDetailTemplate, events);
const orderFormView = new OrderFormView(
	orderFormStageAddressElement,
	orderFormStageEmailElement,
	orderFormStageSuccessElement,
	events
);

try {
    api.getCatalogItems().then((items) => {
	items.forEach((item) => {
		const cardView = new ProductView(cardTemplate, events);
        const cardModel = new ProductModel(item)
		catalogElement.append(cardView.render(cardModel));
	});
});
} catch (error) {
    console.log(error)
}


document.body.append(modal.render())

//Инициализация слушателей
headerBasketElement.addEventListener('click', () => {
	events.emit('basket:detail');
});

document.addEventListener('keydown', (event: KeyboardEvent) => {
	if (event.key === 'Escape') {
		events.emit('modal:close');
	}
});

//Обработка событий
events.on('product:detail', (item: IProductItem) => {
    const inBasket = basket.items.some(basketItem => item.id === basketItem.id)
    const cardModel = new ProductModel(item)
	modal.open(cardDetailView.render(cardModel, inBasket));
});

events.on('modal:open', () => {
	window.scrollTo({
		top: 0,
	});
	document.body.style.overflow = 'hidden';
});

events.on('modal:close', () => {
	document.body.style.overflow = '';
	modal.close();
});

events.on('product:add-to-basket', (item: ProductModel) => {
	basket.addItem(item as TBasketItem);
	headerBasketCounterElement.textContent = `${basket.count}`;
	modal.open(cardDetailView.render(item, true))
});

events.on('product:remove-from-basket-in-card', (item: ProductModel) => {
	basket.removeItem(item.id);
	headerBasketCounterElement.textContent = `${basket.count}`;
    modal.open(cardDetailView.render(item, false))
});

events.on('product:remove-from-basket', (item: TBasketItem) => {
	basket.removeItem(item.id);
	basketView.render(basket.items);
	headerBasketCounterElement.textContent = `${basket.count}`;
});

events.on('basket:detail', () => {
	modal.open(basketView.render(basket.items));
});

events.on('basket:to-order', () => {
	modal.open(orderFormView.render('address'));
});

events.on('order:stage-contacts', () => {
	modal.open(orderFormView.render('contacts'));
});

events.on('order:stage-success', (data: IFormData) => {
	const orderBasket: TOrderItem[] = basket.items.map(
		(item: TBasketItem) => item.id
	);

	const orderData: IOrderData = {
		payment: data.payment,
		email: data.email,
		phone: data.phone,
		address: data.address,
		total: basket.total,
		items: orderBasket,
	};
	try {
		api.saveOrder(orderData).then((response) => {
			modal.open(orderFormView.render('success', response));
            basket.clearBasket()
            headerBasketCounterElement.textContent = `${basket.count}`;
		});
	} catch (error) {
		console.log(error);
	}
});
