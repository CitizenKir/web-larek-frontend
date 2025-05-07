import { IOrderData, IOrderResult, TPaymentType } from '../../types';
import { ApiRequestModel } from './ApiRequestModel';

export interface IOrderModel {
    order: IOrderData
    saveOrder(): void
    validateOrder(): boolean
}

export class OrderModel implements IOrderModel {

    constructor(protected order: IOrderData, private api: ApiRequestModel) {}

    static async saveOrder(): Promise<IOrderResult> {

    }

    validateOrder(): boolean {

    }
}
