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

export interface IOrderData extends IContactData {
    payment: TPaymentType
    items: Pick<IProductItem, "id">[];
    total: number;
}

export interface IOrderResult {
    id: string;
    total: number;
}

export type TBasketItem = Pick<IProductItem, "id" | "title" | "price">;

export type TPaymentType = 'online' | 'onReceipt';

export type TOrderStage = 'address' | 'contacts' | 'success';

export type EventType =
    'product:detail' |
    'product:add-to-basket' |
    'basket:detail' |
    'basket:to-order' |
    'modal:open' |
    'modal:close' |
    'order:stage-address' |
    'order:stage-contacts' |
    'order:stage-success' |
    'order:error'

