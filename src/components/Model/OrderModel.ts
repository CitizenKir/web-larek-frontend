import { IOrderData, IOrderResult, TPaymentType } from '../../types';
import { ApiService, IApiService } from '../ApiService';

export interface IOrderModel {
    order: IOrderData
    saveOrder(): Promise<IOrderResult> 
    validateOrder(): boolean
}

export class OrderModel implements IOrderModel {

    constructor(protected _order: IOrderData, private api: IApiService) {}

    get order (): IOrderData {
        return this._order
    }

    static async saveOrder(): Promise<IOrderResult> {
        
    }

    validateOrder(): boolean {
        return true
    }
}
