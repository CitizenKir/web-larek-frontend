import { ensureElement } from '../../utils/utils';

export class PageView {
	readonly catalogElement: HTMLElement;
	readonly headerBasketElement: HTMLElement;
	readonly headerBasketCounterElement: HTMLElement;
	readonly cardTemplate: HTMLTemplateElement;
	readonly cardBasketTemplate: HTMLTemplateElement;
	readonly cardDetailTemplate: HTMLTemplateElement;
	readonly basketTemplate: HTMLTemplateElement;
	readonly modalElement: HTMLElement;
	readonly orderFormStageAddressTemplate: HTMLTemplateElement;
	readonly orderFormStageEmailTemplate: HTMLTemplateElement;
	readonly orderFormStageSuccessTemlate: HTMLTemplateElement;

	constructor(public pageElement: HTMLElement) {
		this.catalogElement = ensureElement<HTMLElement>(
			'.gallery',
			this.pageElement
		);
		this.headerBasketElement = ensureElement<HTMLElement>(
			'.header__basket',
			this.pageElement
		);
		this.headerBasketCounterElement = ensureElement<HTMLElement>(
			'.header__basket-counter',
			this.pageElement
		);
		this.cardTemplate = ensureElement<HTMLTemplateElement>(
			'#card-catalog',
			this.pageElement
		);
		this.cardBasketTemplate = ensureElement<HTMLTemplateElement>(
			'#card-basket',
			this.pageElement
		);
		this.cardDetailTemplate = ensureElement<HTMLTemplateElement>(
			'#card-preview',
			this.pageElement
		);
		this.basketTemplate = ensureElement<HTMLTemplateElement>(
			'#basket',
			this.pageElement
		);
		this.modalElement = ensureElement<HTMLElement>('.modal', this.pageElement);
		this.orderFormStageAddressTemplate = ensureElement<HTMLTemplateElement>(
			'#order',
			this.pageElement
		);
		this.orderFormStageEmailTemplate = ensureElement<HTMLTemplateElement>(
			'#contacts',
			this.pageElement
		);
		this.orderFormStageSuccessTemlate = ensureElement<HTMLTemplateElement>(
			'#success',
			this.pageElement
		);
	}

	get basketCount(): number {
		return Number.parseInt(this.headerBasketCounterElement.textContent);
	}

	set basketCount(count: number) {
		this.headerBasketCounterElement.textContent = count.toString();
	}

	renderCatalogItem(item: HTMLElement): void {
		this.catalogElement.append(item);
	}

	renderModal(modal: HTMLElement) {
		this.catalogElement.append(modal);
	}
}
