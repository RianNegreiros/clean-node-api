import { HttpRequest, HttpResponse, Controller, AddAccount, Authentication } from "./signup-controller-protocols"
import { EmailInUseError, InvalidParamError } from "../../errors"
import { badRequest, forbidden, ok, serverError } from "../../helpers/http/http-helpers"
import { Validation } from "../../protocols/validation"

export class SignUpController implements Controller {
    constructor(
        private readonly addAccount: AddAccount,
        private readonly validation: Validation,
        private readonly authentication: Authentication
    ) { }
    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        try {
            const error = this.validation.validate(httpRequest.body)
            if (error) {
                return badRequest(error)
            }
            const { name, email, password, passwordConfirmation } = httpRequest.body
            if (password !== passwordConfirmation) {
                return badRequest(new InvalidParamError('passwordConfirmation'))
            }
            const account = await this.addAccount.add({
                name,
                email,
                password
            })
            if (!account) {
                return forbidden(new EmailInUseError())
            }
            const accessToken = await this.authentication.auth({
                email,
                password
            })
            return ok({ accessToken })
        } catch (error) {
            return serverError(error)
        }
    }
}