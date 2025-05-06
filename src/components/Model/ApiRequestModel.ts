export interface IApiRequestModel {
    cache: Record<string, object>
    get(uri: string): Promise<object>;
    post(uri: string, body: object): Promise<object>;
}