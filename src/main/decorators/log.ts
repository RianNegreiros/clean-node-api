import { LogErrorReposiory } from "../../data/protocols/log-error-repository"
import { Controller, HttpRequest, HttpResponse } from "../../presentation/protocols"

export class LogControllerDecoretor implements Controller {
    private readonly controller: Controller
    private readonly logErrorReposiory: LogErrorReposiory

    constructor (controller: Controller, logErrorReposiory: LogErrorReposiory) {
        this.controller = controller
        this.logErrorReposiory = logErrorReposiory
    }

    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
        const httpResponse = await this.controller.handle(httpRequest)
        if (httpResponse.statusCode === 500) {
            await this.logErrorReposiory.log(httpResponse.body.stack)
        }
        return httpResponse
    }
}