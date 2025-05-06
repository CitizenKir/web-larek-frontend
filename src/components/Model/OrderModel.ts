import { IOrderData } from "../../types";

export interface IOrderModel extends IOrderData {
    saveOrder(): void
    validateOrder(): boolean
}