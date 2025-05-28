# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения (связывает модели и представления)
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами
- src/components/Model — Модели сущностей приложения
- src/components/View — Представления сущностей приложения


## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```


# Архитектура

Приложение реализует паттерн Model View Presenter

## Типы данных

Тип продукта
```
export interface IProductItem {
    id: string;
    title: string;
    description: string;
    category: string;
    image: string;
    price: number;
}
```

Тип корзины
```
export interface IBasketData {
    items: TBasketItem[];
    count: number;
    total: number;
}
```

Контактные данные
```
export interface IContactData {
    address: string;
    email: string;
    phone: string;
}
```
Данные формы
```
export interface IFormData extends IContactData {
    payment: TPaymentType
}
```
Данные заказа
```
export interface IOrderData extends IFormData {
    items: TOrderItem[];
    total: number;
}
```
Успешный ответ сервера при создании заказа
```
export interface IOrderResult {
    id: string;
    total: number;
}
```
Успешный запроса товаров на сервере
```
export type TProductListResponse = {
    total: number;
    items: IProductItem[];
}
```
Элемент корзины
```
export type TBasketItem = Pick<IProductItem, "id" | "title" | "price">;
```
Элемент заказа
```
export type TOrderItem = string;
```
Типы оплат
```
export type TPaymentType = 'card' | 'cash';
```
Стадии заказа
```
export type TOrderStage = 'address' | 'contacts' | 'success';
```
События в приложении
```
export type EventType =
    'product:detail' |
    'product:add-to-basket' |
    'product:remove-from-basket' |
    'product:remove-from-basket-in-card' |
    'basket:detail' |
    'basket:to-order' |
    'modal:open' |
    'modal:close' |
    'order:stage-address' |
    'order:stage-contacts' |
    'order:stage-success' |
    'order:error'
```
Цвета категорий товаров
```
export enum CategoryColors {
    "хард-скил" = "hard",
    "другое" = "other",
    "дополнительное" = "additional",
    "кнопка" = "button",
    "софт-скил" = "soft",
}
```

## Слой данных
Слой данных представлен моделями:

### BasketModel

Назначение: Работа с корзиной товаров

Свойства:

`items` - Товары в корзине `TBasketItem[]`

`total` - Общая сумма товаров в корзине

`count`  - Количество товаров в корзине

Методы:

`addItem(item: TBasketItem)` - Добавить товар в корзину

`removeItem(id: string)` - Удалить товар из корзины

`clearBasket()` - Очистить корзину


Пример:
```
const basket = new BasketModel()
basket.addItem(product: TBasketItem)
```

### ProductModel
Имплементирует `IProductModel` 

```
export interface IProductModel extends IProductItem {
    badgeColor: string;
}
```

Назначение: Работа с товаром
Свойства:

`badgeColor` - цвет категории

Конструктор принимает данные о продукте соответствующие типу `IProductItem`

```
 constructor(
      productData: IProductItem,
    ) {
        this.id = productData.id;
        this.title = productData.title;
        this.description = productData.description;
        this.category = productData.category;
        this.image = productData.image;
        this.price = productData.price;
        this.badgeColor = CategoryColors[productData.category as keyof typeof CategoryColors]

    }
```


Пример:
```
const product = new ProductModel(item)
```

## Слой представлений (Views)
### ModalView
Назначение: Базовое модальное окно

Методы:

`open(content: HTMLElement)` - Открыть модальное окно с переданным содержимым

`close()` - Закрыть модальное окно

Пример:
```
const element = document.querySelector('.element')
const modal = new ModalView(template)
modal.open(element)
```

### BasketView

Назначение: Отображение корзины

Методы:

`render(items: TBasketItem[])` - Отрисовать корзину с переданными товарами с типом `TBasketItem[]`

Конструктор принимает HTML шаблон и брокер событий

```
constructor(private template: HTMLTemplateElement, private events: IEvents) {
    super(template, events);
}
```

Пример:
```
const events = new EventEmitter()
const basket = new BasketModel()
basket.addItem(product)

const view = new BasketView(template, events)
view.render(basket.items)
```

### ProductView
Назначение: Отображение крточки товара в каталоге

Конструктор принимает HTML шаблон и брокер событий

```
constructor(private template: HTMLTemplateElement, private events: IEvents) {
    super(template, events);
}
```

Методы:

`render(item: ProductModel)` - Отрисовать товар

Пример:
```
const events = new EventEmitter();
const productView = new ProductView(template, events)

document.body.append(ProductView.render(item))
```

### ProductDetailView

Наследует `ProductView`

Назначение: Подробная карточка товара

Конструктор принимает HTML шаблон и брокер событий

```
constructor(private template: HTMLTemplateElement, private events: IEvents) {
    super(template, events);
}
```

Методы:

`render(item: ProductModel)` - Отрисовать детальную карточку товара

Пример:
```
const modal = new ModalView();
const events = new EventEmitter();
const productDetailView = new ProductDetailView(template, events)

modal.open(productDetailView.render(item))
```

### OrderFormView

Назначение: Форма заказа

`render(stage: TOrderStage)` - Отрисовать этап формирования заказа

Конструктор принимает HTML шаблоны стадий заказа и брокер событий

```
constructor(
		stageAddressTemplate: HTMLTemplateElement,
		stageContactsElement: HTMLTemplateElement,
		stageSuccessElement: HTMLTemplateElement,
		protected events: IEvents
	)
```

Пример:

```
const events = new EventEmitter();
const formView = new OrderFormView(template1, template2, template3, events)

modal.open(formView.render('address'))
```

## Presenter
Связью данных и отображений выступает корневой `index.ts` в котором происходит обработка событий. События генерируются отображениями в зависимости от действий пользователя. В отображения принимают данные моделей.

Конструкторы классов отображений принимают шаблоны разметки `HTMLTemplateElement` и брокеры событий с типом `IEvents`

### Обработка событий
Базовый интерфейс 
```
export interface IEvents {
    on<T extends object>(event: EventName, callback: (data: T) => void): void;
    emit<T extends object>(event: string, data?: T): void;
    trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void;
}
```
`on(event: string)` - Установить обработчик на событие \
`emit(event: string, data?: object)` - Инициировать событие с данными \
`trigger()` - Сделать коллбек триггер, генерирующий событие при вызове 

## Requests

### ApiService
Реализует паттерн синглтон, получить инстанс класса можно через `getInstance()`

Назначение: Работа с API и кэширование запросов

Методы:

`getInstance` - Возвращает единственный экземпляр класса

`get<T>(uri)` - GET-запрос

`post<T>(uri, body)` - POST-запрос

`getCatalogItems()` - Получить товары для магазина

`saveOrder(order: IOrderData)` - Сохранить заказ на сервере

Пример:
```
const api = new ApiService.getInstance()
const data = await api.get<TProductListResponse>('/product/')
```

