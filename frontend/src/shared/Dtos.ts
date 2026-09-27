export type response<T> = {
    success: boolean,
    message: string,
    data: T
}