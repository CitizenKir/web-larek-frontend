import { TBasketItem } from "../../types";
import { IModalView, ModalView } from "./ModalView";
import { IEvents } from '../base/events';
import { cloneTemplate } from "../../utils/utils";

export interface IBasketView {
    render(items: TBasketItem[]): HTMLElement
}

export class BasketView implements IBasketView {
    protected element: HTMLElement
    protected basketListElement: HTMLElement
    protected cardElement: HTMLElement
    protected buyButton: HTMLButtonElement
    protected sumElement: HTMLElement

    constructor(protected template: HTMLTemplateElement, protected cardTemplate: HTMLTemplateElement, protected events: IEvents) {
        this.element = cloneTemplate(template)
        this.basketListElement = this.element.querySelector('.basket__list')
        this.cardElement = cloneTemplate(cardTemplate)
        this.buyButton = this.element.querySelector('.button')
        this.sumElement = this.element.querySelector('.basket__price')
    }

    protected getSum(items: TBasketItem[]): number {
        return items.reduce((sum, item) => item.price + sum, 0);
    }

    private renderItem(item: TBasketItem, index: number): HTMLElement {
        const cardItemElement = this.cardElement.cloneNode(true) as HTMLElement
        const cardItemIndexElement = cardItemElement.querySelector('.basket__item-index')
        const cardItemTitleElement = cardItemElement.querySelector('.card__title')
        const cardItemPriceElement = cardItemElement.querySelector('.card__price')
        const cardItemDeleteButton = cardItemElement.querySelector('.basket__item-delete')

        cardItemIndexElement.textContent = `${index}`
        cardItemTitleElement.textContent = item.title
        cardItemPriceElement.textContent = `${item.price ?? 'Бесценно'}`
        cardItemDeleteButton.addEventListener('click', () => {
            this.events.emit('product:remove-from-basket', item)
        })

        return cardItemElement
    }

    render(items: TBasketItem[]): HTMLElement {
        if (this.getSum(items) === 0) {
            this.buyButton.disabled = true
        } else {
            this.buyButton.disabled = false
        }
        this.buyButton.addEventListener('click', () => {
            this.events.emit('basket:to-order')
        })
        this.basketListElement.innerHTML = ''
        this.sumElement.textContent = `${this.getSum(items)} синапсов`
        
        items.forEach((item, index) => {
            this.basketListElement.append(this.renderItem(item, index + 1))
        })

        return this.element
    }
}
