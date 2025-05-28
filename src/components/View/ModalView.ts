import { IEvents } from '../base/events';

export interface IModalView {
	open(content: HTMLElement): void;
	close(): void;
}

export class ModalView implements IModalView {
	protected element: HTMLElement;
	protected contentElement: HTMLElement;
	protected buttonCloseElement: HTMLButtonElement;
	protected containerElement: HTMLElement;

	constructor(protected template: HTMLElement, protected events: IEvents) {
		this.element = template.cloneNode(true) as HTMLElement;
		this.containerElement = this.element.querySelector('.modal__container');
		this.contentElement = this.element.querySelector('.modal__content');
		this.contentElement.innerHTML = '';
		this.buttonCloseElement = this.element.querySelector('.modal__close');
		this.element.addEventListener('click', (event: MouseEvent) => {
			if (event.target === this.element) {
				events.emit('modal:close');
			}
		});
		this.buttonCloseElement.addEventListener('click', () =>
			events.emit('modal:close')
		);
	}

	render() {
		return this.element;
	}

	open(content: HTMLElement): void {
		this.events.emit('modal:open');
		this.element.classList.add('modal_active');
		this.contentElement.replaceChildren(content);
	}

	close(): void {
		this.contentElement.innerHTML = '';
		this.element.classList.remove('modal_active');
	}
}
