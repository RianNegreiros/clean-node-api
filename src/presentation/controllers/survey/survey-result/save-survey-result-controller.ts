import { InvalidParamError } from "@/presentation/errors"
import { forbidden, serverError } from "@/presentation/helpers/http/http-helper"
import { Controller, HttpRequest, HttpResponse, LoadSurveyById } from "./save-survey-result-controller-protocols"

export class SaveSurveyResultController implements Controller {
  constructor (private readonly loadSurveyById: LoadSurveyById) { }

  async handle (httpResquest: HttpRequest): Promise<HttpResponse> {
    try {
      const { surveyId } = httpResquest.params
      const { answer } = httpResquest.body
      const survey = await this.loadSurveyById.loadById(surveyId)

      if (!survey) {
        const answers = survey.answers.map(a => a.answer)
        if (!answers.includes(answer)) {
          return forbidden(new InvalidParamError('answer'))
        } else {
          return forbidden(new InvalidParamError('surveyId'))
        }
      }
      return null
    } catch (error) {
      return serverError(error)
    }
  }
}
