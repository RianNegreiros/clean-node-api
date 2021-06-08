import { InvalidParamError } from "@/presentation/errors"
import { forbidden } from "@/presentation/helpers/http/http-helper"
import { Controller, HttpRequest, HttpResponse, LoadSurveyById } from "./save-survey-result-controller-protocols"

export class SaveSurveyResultController implements Controller {
  constructor (private readonly loadSurveyById: LoadSurveyById) {}

  async handle (httpResquest: HttpRequest): Promise<HttpResponse> {
    const survey = await this.loadSurveyById.loadById(httpResquest.params.surveyId)
    if (!survey) {
      return forbidden(new InvalidParamError('surveyId'))
    }
    return null
  }
}
