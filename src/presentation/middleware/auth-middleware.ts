import { AccessDeniedError } from "../errors"
import { forbidden } from "../helpers/http/http-helpers"
import { HttpRequest, HttpResponse, Middleware } from "../protocols"

export class AuthMiddleware implements Middleware {
    handle (httpRequest: HttpRequest): Promise<HttpResponse> {
        const error = forbidden(new AccessDeniedError())
        return new Promise(resolve => resolve(error))
    }
}