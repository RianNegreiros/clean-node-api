import { MissingParamError } from "../../errors";
import { badRequest } from "../../helpers/http-helpers";
import { Controller, EmailValidator, HttpRequest, HttpResponse } from "../../protocols";

export class LoginController implements Controller {
    private readonly emailValidator: EmailValidator
    constructor (emailValidator: EmailValidator) {
        this.emailValidator = emailValidator
    }

    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        if (!httpRequest.body.email) {
            return new Promise(resolve => resolve(badRequest(new MissingParamError('email'))))
        }
        if (!httpRequest.body.password) {
            return new Promise(resolve => resolve(badRequest(new MissingParamError('password'))))
        }
    }
}