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
Продукт, продаваемый в магазине
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

Данные, содержащиеся в корзине
```
export interface IBasketData {
    items: TBasketItem[];
    count: number;
    total: number;
}
```
Тип для продукта, содержащегося в свойстве `items` 
```
export type TBasketItem = Pick<IProductItem, "id" | "title" | "price">;
```
Контактные данные покупателя
```
export interface IContactData {
    address: string;
    email: string;
    phone: string;
}
```

Тип, описывающий все свойства заказа
```
export interface IOrderData extends IContactData {
    payment: TPaymentType
    items: Pick<IProductItem, "id">[];
    total: number;
}
```
Тип возвращаемого ответа от бэкенда, в случае успешного создания заказа
```
export interface IOrderResult {
    id: string;
    total: number;
}
```
Допустимые типы оплат
```
export type TPaymentType = 'online' | 'onReceipt';
```
Стадии создания заказа
```
export type TOrderStage = 'address' | 'contacts' | 'success';
```
### Типы событий в приложении
```
export type EventType =
    'product:detail' | // открытие детальной страницы товара
    'product:add-to-basket' | // добавление товара в корзину
    'basket:detail' | // открытие корзины
    'basket:to-order' | // сформировать заказ
    'modal:open' | // открытие модального окна
    'modal:close' | // закрытие модального окна
    'order:stage-address' | // заказ на стадии сбора адреса
    'order:stage-contacts' | // заказ на стадии сбора контактов
    'order:stage-success' | // заказ создан успешно
    'order:error' //ошибка в заказе
```

## Слой данных
Слой данных представлен моделями:

### ApiRequestModel
Назначение: Работа с API и кэширование запросов

Методы:

`get(uri)` - GET-запрос с кэшированием

`post(uri, body)` - POST-запрос

Пример:
```
const api = new ApiRequestModel()
const data = await api.get('/product')
```

### CatalogModel
Назначение: Управление каталогом товаров

Методы:

`getCatalogItems()` - Получение списка товаров

Зависимости: `ApiRequestModel`

Конструктор принимает модель для работы с API  
```
constructor(private api: ApiRequestModel) {}
```

Пример:

```
const catalog = new CatalogModel(api)
const items = await catalog.getCatalogItems()
```

### BasketModel

Назначение: Работа с корзиной товаров

Свойства:

`items` - товары в корзине

`total` - общая сумма

`count`  - количество товаров

Методы:

`addItem()` - Добавить товар

`removeItem()` - Удалить товар

`clearBasket()` - Очистить корзину


Пример:
```
const basket = new BasketModel()
basket.addItem(product)
```

### OrderModel

Назначение: Оформление заказов

Методы:

`saveOrder()` - Сохранить заказ

`validateOrder()` - Проверить правильность заказа

Зависимости: `ApiRequestModel`

Конструктор принимает данные заказа соответствующие типу `IOrderData` и экземпляр `ApiRequestModel`
```
constructor(protected _order: IOrderData, private api: ApiRequestModel) {}
```

Пример:
```
const order = new OrderModel(orderData, api)
order.saveOrder()
```

### ProductModel

Назначение: Работа с товаром
Свойства:

`badgeColor` - цвет категории

Методы:

`inBasket()` - Проверить наличие в корзине

Конструктор принимает данные о продукте соответствующие типу `IProductItem`
и экземпляр класса `BasketModel`

```
 constructor(
      productData: IProductItem,
      private basket: BasketModel
    ) {
        this.id = productData.id;
        this.title = productData.title;
        this.description = productData.description;
        this.category = productData.category;
        this.image = productData.image;
        this.price = productData.price;
    }
```


Пример:
```
const product = new ProductModel(data, basket)
product.inBasket()
```

## Слой представлений (Views)
### ModalView
Назначение: Базовое модальное окно

Методы:

`open()` - Открыть

`close()` - Закрыть
Пример:
```
const modal = new ModalView(template)
modal.open()
```

### BasketView

Наследует `ModalView`

Назначение: Отображение корзины

Методы:

`render(items)` - Отрисовать корзину

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

### CatalogView
Назначение: Отображение каталога

Конструктор принимает HTML шаблон и брокер событий

```
constructor(private template: HTMLTemplateElement, private events: IEvents) {}
```

Методы:

`render(items)` - Отрисовать каталог

Пример:
```
const view = new CatalogView(template)
view.render(catalogItems)
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

`render(item)` - Отрисовать товар

`open()/close()` - Управление видимостью

Пример:
```
const events = new EventEmitter();
const modalDetailView = new ProductDetailView(template, events)
modalDetailView.open()
modalDetailView.render(product)
```

### ProductDetailView

Наследует `ModalView`

Назначение: Подробная карточка товара

Конструктор принимает HTML шаблон и брокер событий

```
constructor(private template: HTMLTemplateElement, private events: IEvents) {
    super(template, events);
}
```

Методы:

`render(item)` - Отрисовать товар

`open()/close()` - Управление видимостью

Пример:
```
const events = new EventEmitter();
const modalDetailView = new ProductDetailView(template, events)
modalDetailView.open()
modalDetailView.render(product)
```

### OrderFormView

Наследует `ModalView`

Назначение: Форма заказа

Свойства:

`stage` - текущий этап оформления

Методы:

`render()` - Отрисовать форму

Конструктор принимает HTML шаблон и брокер событий

```
constructor(private template: HTMLTemplateElement, private events: IEvents) {
    super(template, events)
}
```

Пример:

```
const events = new EventEmitter();
const form = new OrderFormView(template, events)
form.open()
form.render()
```

## Presenter
Связывание данных и отображений приложения происходит в корневом файле `index.ts`. В этом же файле происходит подписка сущностей на события.\

Конструкторы классов отображений принимают шаблоны разметки `HTMLTemplateElement` и брокеры событий с типом `IEvents`

Базовый интерфейс 
```
export interface IEvents {
    on<T extends object>(event: EventName, callback: (data: T) => void): void;
    emit<T extends object>(event: string, data?: T): void;
    trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void;
}
```
`on()` - Установить обработчик на событие \
`emit()` - Инициировать событие с данными \
`trigger()` - Сделать коллбек триггер, генерирующий событие при вызове 

