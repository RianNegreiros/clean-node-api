import { badRequest } from "../../../helpers/http/http-helpers"
import { Validation } from "../../../protocols/validation"
import { Controller, HttpRequest, HttpResponse } from "./add-survey-protocols"

export class AddSurveyController implements Controller {
    constructor (
        private readonly validation: Validation
    ) {}

    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
        const error = this.validation.validate(httpRequest.body)
        if (error) {
            return badRequest(error)
        }
        return new Promise(resolve => resolve(null))
    }
}