import { ErrorKind } from "./error-kind.js";

export class ApplicationError extends Error {
    constructor(public readonly code: string,message: string,public readonly kind: ErrorKind) {
        super(message)
        this.name = "ApplicationError"
    }
}