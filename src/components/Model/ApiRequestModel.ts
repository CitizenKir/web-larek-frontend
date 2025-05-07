export interface IApiRequestModel {
    cache: Record<string, object>
    get(uri: string): Promise<object>;
    post(uri: string, body: object): Promise<object>;
}

export class ApiRequestModel implements IApiRequestModel {
    cache: Record<string, object> = {};

    async get(uri: string): Promise<object> {
        if (this.cache[uri]) {
            return Promise.resolve(this.cache[uri]);
        }
    }

    async post(uri: string, body: object): Promise<object> {

    }
}
