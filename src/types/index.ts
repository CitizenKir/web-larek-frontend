export interface IProductItem {
    id: string;
    title: string;
    description: string;
    category: string;
    image: string;
    price: number;
}

export interface IBasketData {
    items: TBasketItem[];
    count: number;
    total: number;
}

export interface IContactData {
    address: string;
    email: string;
    phone: string;
}

export interface IFormData extends IContactData {
    payment: TPaymentType
}

export interface IOrderData extends IFormData {
    items: TOrderItem[];
    total: number;
}

export interface IOrderResult {
    id: string;
    total: number;
}

export type TProductListResponse = {
    total: number;
    items: IProductItem[];
}

export type TBasketItem = Pick<IProductItem, "id" | "title" | "price">;

export type TOrderItem = string;

export type TPaymentType = 'card' | 'cash';

export type TOrderStage = 'address' | 'contacts' | 'success';

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

export enum CategoryColors {
    "хард-скил" = "hard",
    "другое" = "other",
    "дополнительное" = "additional",
    "кнопка" = "button",
    "софт-скил" = "soft",
}
