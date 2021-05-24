import { HttpRequest, HttpResponse, EmailValidator, Controller, AddAccount } from "./signup-protocols"
import { InvalidParamError, MissingParamError } from "../../errors"
import { badRequest, ok, serverError } from "../../helpers/http-helpers"
import { Validation } from "../../helpers/validators/validation"

export class SignUpController implements Controller {
    private readonly emailValidator: EmailValidator
    private readonly addAccount: AddAccount
    private readonly validation: Validation

    constructor(emailValidator: EmailValidator, addAccount: AddAccount, validation: Validation) {
        this.emailValidator = emailValidator
        this.addAccount = addAccount
    }
    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        try {
            const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
            for (const field of requiredFields) {
                if (!httpRequest.body[field]) {
                    return badRequest(new MissingParamError(field))
                }
            }
            const { name, email, password, passwordConfirmation } = httpRequest.body
            if (password !== passwordConfirmation) {
                return badRequest(new InvalidParamError('passwordConfirmation'))
            }

            const isValid = this.emailValidator.isValid(email)
            if (!isValid) {
                return badRequest(new InvalidParamError('email'))
            }
            const account = await this.addAccount.add({
                name,
                email,
                password
            })
            return ok(account)
        } catch (error) {
            return serverError(error)
        }
    }
}