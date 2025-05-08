export interface IApiRequestModel {
    cache: Record<string, object>
    get<T>(uri: string): Promise<T>;
    post(uri: string, body: object): Promise<object>;
}

export class ApiRequestModel implements IApiRequestModel {
    cache: Record<string, object> = {};

    async get<T>(uri: string): Promise<T> {
        if (this.cache[uri]) {
        
        } else {
            
        }
    }

    async post(uri: string, body: object): Promise<object> {

    }
}
