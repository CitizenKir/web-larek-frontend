import {
	IOrderData,
	IOrderResult,
	IProductItem,
	TProductListResponse,
} from '../types';
import { API_URL } from '../utils/constants';
import { Api } from './base/api';

export interface IApiService {
	get<T>(uri: string): Promise<T>;
	post(uri: string, body: object): Promise<object>;
	getCatalogItems(): Promise<IProductItem[]>;
}

export class ApiService implements IApiService {
	private static instance: ApiService;
	apiProvider = new Api(API_URL);

	private constructor() {}

	public static getInstance(): ApiService {
		if (!ApiService.instance) {
			ApiService.instance = new ApiService();
		}
		return ApiService.instance;
	}

	async get<T>(uri: string): Promise<T> {
		return this.apiProvider.get(uri) as T;
	}

	async post<T>(uri: string, body: object): Promise<T> {
		return this.apiProvider.post(uri, body) as T;
	}

	async getCatalogItems(): Promise<IProductItem[]> {
		const response = await this.get<TProductListResponse>('/product/');
		return response.items as IProductItem[];
	}

	saveOrder(order: IOrderData): Promise<IOrderResult> {
		return this.post<IOrderResult>('/order/', order);
	}
}
