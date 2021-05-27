import { Validation } from "../../../protocols/validation"
import { Controller, HttpRequest, HttpResponse } from "./add-survey-protocols"

export class AddSurveyController implements Controller {
    constructor (
        private readonly validation: Validation
    ) {}

    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
        this.validation.validate(httpRequest.body)
        return new Promise(resolve => resolve(null))
    }
}