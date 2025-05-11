export interface IApiService {
    cache: Record<string, object>
    get<T>(uri: string): Promise<T>;
    post(uri: string, body: object): Promise<object>;
}

export class ApiService implements IApiService {
    private static instance: ApiService;
    cache: Record<string, object> = {};

    private constructor() {}

    public static getInstance(): ApiService {
        if (!ApiService.instance) {
            ApiService.instance = new ApiService();
        }
        return ApiService.instance;
    }

    async get<T>(uri: string): Promise<T> {
        if (this.cache[uri]) {
        
        } else {
            
        }
    }

    async post(uri: string, body: object): Promise<object> {

    }
}
