import { EventEmitter } from './components/base/events';
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
import { PageView } from './components/View/PageView';

const events = new EventEmitter();
const api = ApiService.getInstance();
const basket = new BasketModel();

//Инициализация компонентов отображения
const pageView = new PageView(document.body);
const modal = new ModalView(pageView.modalElement, events);
const basketView = new BasketView(
	pageView.basketTemplate,
	pageView.cardBasketTemplate,
	events
);
const cardDetailView = new ProductDetailView(
	pageView.cardDetailTemplate,
	events
);
const orderFormView = new OrderFormView(
	pageView.orderFormStageAddressTemplate,
	pageView.orderFormStageEmailTemplate,
	pageView.orderFormStageSuccessTemlate,
	events
);

pageView.renderModal(modal.render());

try {
	api.getCatalogItems().then((items) => {
		items.forEach((item) => {
			const cardView = new ProductView(pageView.cardTemplate, events);
			const cardModel = new ProductModel(item);
			pageView.renderCatalogItem(cardView.render(cardModel));
		});
	});
} catch (error) {
	console.log(error);
}

//Инициализация слушателей
pageView.headerBasketElement.addEventListener('click', () => {
	events.emit('basket:detail');
});

//Обработка событий
events.on('product:detail', (item: IProductItem) => {
	const inBasket = basket.items.some((basketItem) => item.id === basketItem.id);
	const cardModel = new ProductModel(item);
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
	pageView.basketCount = basket.count;
	modal.open(cardDetailView.render(item, true));
});

events.on('product:remove-from-basket-in-card', (item: ProductModel) => {
	basket.removeItem(item.id);
	pageView.basketCount = basket.count;
	modal.open(cardDetailView.render(item, false));
});

events.on('product:remove-from-basket', (item: TBasketItem) => {
	basket.removeItem(item.id);
	basketView.render(basket.items);
	pageView.basketCount = basket.count;
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
			basket.clearBasket();
			pageView.basketCount = basket.count;
		});
	} catch (error) {
		console.log(error);
	}
});
