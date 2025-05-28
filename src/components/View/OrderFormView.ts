import { IOrderResult, TOrderStage } from '../../types';
import { cloneTemplate } from '../../utils/utils';
import { IEvents } from '../base/events';

export interface IOrderFormView {
	render(stage: TOrderStage): HTMLElement;
}
export class OrderFormView implements IOrderFormView {
	protected formData: FormData;
	protected formErrors: Map<string, string>;
	protected addressElement: HTMLFormElement;
	protected contactsElement: HTMLElement;
	protected successElement: HTMLElement;

	constructor(
		stageAddressTemplate: HTMLTemplateElement,
		stageContactsElement: HTMLTemplateElement,
		stageSuccessElement: HTMLTemplateElement,
		protected events: IEvents
	) {
		this.addressElement = cloneTemplate(stageAddressTemplate);
		this.contactsElement = cloneTemplate(stageContactsElement);
		this.successElement = cloneTemplate(stageSuccessElement);
		this.formData = new FormData();
		this.formErrors = new Map();
	}

	protected getNextStageButton(stage: TOrderStage): HTMLButtonElement {
		switch (stage) {
			case 'address':
			default:
				return this.addressElement.querySelector('div.modal__actions button');
			case 'contacts':
				return this.contactsElement.querySelector('div.modal__actions button');
		}
	}

	protected disableNextStageButton(disable: boolean, stage: TOrderStage): void {
		this.getNextStageButton(stage).disabled = disable;
	}

	protected resetButtons(buttons: Element[], classname: string): void {
		buttons.forEach((button) => {
			button.classList.remove(classname);
		});
	}

	protected renderErrors(stage: TOrderStage): void {
		let formErrorsElement: HTMLElement;

		switch (stage) {
			case 'address':
				formErrorsElement = this.addressElement.querySelector('.form__errors');
				break;
			case 'contacts':
				formErrorsElement = this.contactsElement.querySelector('.form__errors');
				break;
		}
		if (this.formErrors.size > 0) {
			this.formErrors.forEach((error) => {
				formErrorsElement.textContent = error ?? '';
			});
		} else {
			formErrorsElement.textContent = '';
		}
	}

	protected validateForm(stage: TOrderStage): void {
		this.formErrors.clear();
        const phoneRegEx: RegExp = /^\+7\d{10}$/
		if (stage === 'address') {
			if (
				!this.formData.get('address') ||
				(this.formData.get('address') &&
					this.formData.get('address').length < 3)
			) {
				const message = 'Адрес должен содержать более 3-х символов';
				this.formErrors.set('address', message);
			}
			if (!this.formData.has('payment')) {
				const message = 'Выберите тип оплаты';
				this.formErrors.set('paymentType', message);
			}
		} else if (stage === 'contacts') {
            if (!this.formData.get('email')) {
                const message = 'Необходимо указать email'
                this.formErrors.set('email', message)
            }
            if (!this.formData.get('phone') || !phoneRegEx.test(`${this.formData.get('phone')}`)) {
                const message = 'Необходимо указать номер телефона'
                this.formErrors.set('phone', message)
            }
        }

		if (this.formErrors.size === 0) {
			this.disableNextStageButton(false, stage);
		} else {
			this.disableNextStageButton(true, stage);
		}

		this.renderErrors(stage);
	}

	protected processStage(stage: TOrderStage, response?: IOrderResult): void {
		if (stage === 'address') {
			this.getNextStageButton(stage).addEventListener('click', (event) => {
                event.preventDefault()
				this.events.emit('order:stage-contacts');
			});
			const addressInput = this.addressElement.querySelector(
				'.form__input'
			) as HTMLInputElement;
			addressInput.addEventListener('input', () => {
				this.formData.set('address', addressInput.value);
				this.validateForm(stage);
			});
			const paymentTypeButtons = Array.from(
				this.addressElement.querySelectorAll('.button_alt')
			);
			paymentTypeButtons.forEach((button: HTMLButtonElement) => {
				button.addEventListener('click', () => {
					this.resetButtons(paymentTypeButtons, 'button_alt-active');
					this.formData.set('payment', button.name);
					button.classList.add('button_alt-active');
					this.validateForm(stage);
				});
			});
		} else if (stage === 'contacts') {
			const emailInput = this.contactsElement.querySelector(
				'[name="email"]'
			) as HTMLInputElement;
			const phoneInput = this.contactsElement.querySelector(
				'[name="phone"]'
			) as HTMLInputElement;

            emailInput.type = 'email'
            phoneInput.type = 'tel'
            phoneInput.placeholder = '+79951234567'
			emailInput.addEventListener('input', () => {
				this.formData.set('email', emailInput.value);
				this.validateForm(stage);
			});
			phoneInput.addEventListener('input', () => {
				this.formData.set('phone', phoneInput.value);
				this.validateForm(stage);
			});
            this.getNextStageButton(stage).addEventListener('click', (event) => {
                event.preventDefault()
                this.events.emit('order:stage-success', Object.fromEntries(this.formData.entries()));
            })
		} else if(stage === 'success') {
            const sumElement = this.successElement.querySelector('.order-success__description')
            const buttonClose = this.successElement.querySelector('.order-success__close')

            buttonClose.addEventListener('click', () => {
                this.events.emit('modal:close')
            })
            sumElement.textContent = `Списано ${response.total} синапсов`
        }
	}

	render(stage: TOrderStage = 'address', response?: IOrderResult): HTMLElement {
		this.processStage(stage, response);

		switch (stage) {
			case 'address':
			default:
				return this.addressElement;
			case 'contacts':
				return this.contactsElement;
			case 'success':
				return this.successElement;
		}
	}
}
