import { TOrderStage } from "../../types";
import { IModalView } from "./ModalView";

export interface IOrderFormView extends IModalView {
    stage: TOrderStage;
    render(): HTMLElement;               
}