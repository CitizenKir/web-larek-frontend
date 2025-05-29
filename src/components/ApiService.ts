import {
	IOrderData,
	IOrderResult,
	IProductItem,
	TProductListResponse,
} from '../types';
import { API_URL } from '../utils/constants';
import { Api } from './base/api';

export interface IApiService {
	getCatalogItems(): Promise<IProductItem[]>;
	saveOrder(order: IOrderData): Promise<IOrderResult>;
}

export class ApiService extends Api implements IApiService {
	private static instance: ApiService;

	public static getInstance(): ApiService {
		if (!ApiService.instance) {
			ApiService.instance = new ApiService(API_URL);
		}
		return ApiService.instance;
	}

	async getCatalogItems(): Promise<IProductItem[]> {
		const response = await this.get<TProductListResponse>('/product/');

		return response.items;
	}

	async saveOrder(order: IOrderData): Promise<IOrderResult> {
		return this.post<IOrderResult>('/order/', order);
	}
}
