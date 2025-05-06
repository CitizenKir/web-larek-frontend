import { TBasketItem } from "../../types";
import { IModalView } from "./ModalView";

export interface IBasketView extends IModalView {
    render(items: TBasketItem[]): HTMLElement
}