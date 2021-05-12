import { MissingParamError } from "../errors/missing-param-error"
import { badRequest } from "../helpers/http-helpers"
import { HttpRequest, HttpResponse } from "../protocols/http"

export class SignUpController {
    handle(httpResponse: HttpRequest): HttpResponse {
        const requiredFields = ['name', 'email']
        for (const field of requiredFields) {
            if (!httpResponse.body[field]) {
                return badRequest(new MissingParamError(field))
            }
        }
    }
}