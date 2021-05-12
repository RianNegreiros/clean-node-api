import { MissingParamError } from "../errors/missing-param-error"
import { badRequest } from "../helpers/http-helpers"
import { HttpRequest, HttpResponse } from "../protocols/http"
import { Controller } from '../protocols/controller'

export class SignUpController implements Controller {
    handle(httpResponse: HttpRequest): HttpResponse {
        const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
        for (const field of requiredFields) {
            if (!httpResponse.body[field]) {
                return badRequest(new MissingParamError(field))
            }
        }
    }
}