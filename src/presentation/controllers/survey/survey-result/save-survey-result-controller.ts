import { Controller, HttpRequest, HttpResponse, LoadSurveyById } from "./save-survey-result-controller-protocols"

export class SaveSurveyResultController implements Controller {
  constructor (private readonly loadSurveyById: LoadSurveyById) {}

  async handle (httpResquest: HttpRequest): Promise<HttpResponse> {
    await this.loadSurveyById.loadById(httpResquest.params.surveyId)
    return null
  }
}
