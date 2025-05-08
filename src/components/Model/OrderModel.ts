import { IOrderData, IOrderResult, TPaymentType } from '../../types';
import { ApiRequestModel } from './ApiRequestModel';

export interface IOrderModel {
    order: IOrderData
    saveOrder(): Promise<IOrderResult> 
    validateOrder(): boolean
}

export class OrderModel implements IOrderModel {

    constructor(protected _order: IOrderData, private api: ApiRequestModel) {}

    get order (): IOrderData {
        return this._order
    }

    static async saveOrder(): Promise<IOrderResult> {
        
    }

    validateOrder(): boolean {
        return true
    }
}
