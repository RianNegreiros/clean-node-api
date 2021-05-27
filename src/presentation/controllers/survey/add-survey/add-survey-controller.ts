import { AddSurvey } from "../../../../domain/usercases/add-survey"
import { badRequest } from "../../../helpers/http/http-helpers"
import { Validation } from "../../../protocols/validation"
import { Controller, HttpRequest, HttpResponse } from "./add-survey-protocols"

export class AddSurveyController implements Controller {
    constructor (
        private readonly validation: Validation,
        private readonly addSurvey: AddSurvey
    ) {}

    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
        const error = this.validation.validate(httpRequest.body)
        if (error) {
            return badRequest(error)
        }
        const { question, answers } = httpRequest.body
        await this.addSurvey.add({
            question,
            answers
        })
        return null
    }
}