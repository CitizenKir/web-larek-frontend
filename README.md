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

#### Модель апи запросов
```
export interface IApiRequestModel {
    cache: Record<string, object>
    get(uri: string): Promise<object>;
    post(uri: string, body: object): Promise<object>;
}
```
`cache` сохраняет результаты GET запросов к бэкенду\
`get()` метод для отправки GET запросов к бэкенду\
`post()` метод для отправки POST запросов к бэкенду

#### Модель данных корзины
Расширяет интерфейс данных корзины `IBasketData`
```
export interface IBasketModel extends IBasketData {
    addItem(item: IProductItem): void;
    removeItem(id: string): void;
    clearBasket(): void;
}
```
`addItem()` метод для добавления заказа в корзину\
`removeItem()` метод удаления товара из корзины, принимает аргументом `id` товара\
`clearBasket()` метод очищает корзину

#### Модель данных каталога товаров

```
export interface ICatalogModel {
    getCatalogItems(): IProductItem[];
}
```
`getCatalogItems()` возвращает список товаров, доступных для продажи\

### Модель заказа
Наследует интерфейс данных заказа `IOrderData`
```
export interface IOrderModel extends IOrderData {
    saveOrder(): void
    validateOrder(): boolean
}
```

`saveOrder()` метод для отправки заказа на сервер\
`validateOrder()` метод для валидации свойств заказа\

### Модель продукта (товара)
```export interface IProductModel extends IProductItem {
    badgeColor: string;
    inBasket(): boolean;
}
```
`badgeColor` свойство хранит цвет бейджа для категории товара\
`inBasket()` метод определяет, находится ли такой товар в корзине

## Слой отображений
Интерфейс модальных окон приложения
```
export interface IModalView {
    open(): void; // Открытие модального окна
    close(): void; // Закрытие модального окна
}
```
`IBasketView` представление корзины, предоставляет метод `render` принимающий аргументом элементы типа `TBasketItem` возвращает разметку `HTMLElement` 

`ICatalogView` представление каталога товаров, предоставляет метод `render` принимающий аргументом элементы типа `IProductItem` возвращает разметку `HTMLElement`

`IProductView` представление каталога товаров, предоставляет метод `render` принимающий аргументом элементы типа `IProductItem` возвращает разметку `HTMLElement`

Интерфейс представления формы заказа, наследует методы `IModalView`
```
export interface IOrderFormView extends IModalView {
    stage: TOrderStage;
    render(): HTMLElement;               
}
```
`stage`  стадия создания заказа типа `TOrderStage` \
`render()` метод возвращает разметку типа `HTMLElement`

`ProductDetailView` - класс для отображения детальной карточки товара, наследует методы интерфейсов `IModalView`, `IProductView`

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

