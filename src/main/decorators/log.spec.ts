import { LogErrorReposiory } from "../../data/protocols/log-error-repository"
import { serverError } from "../../presentation/helpers/http-helpers"
import { Controller, HttpRequest, HttpResponse } from "../../presentation/protocols"
import { LogControllerDecoretor } from "./log"

interface SutTypes {
    sut: LogControllerDecoretor
    controllerStub: Controller
    logErrorReposioryStub: LogErrorReposiory
}

const makeController = (): Controller => {
    class ControllerStub implements Controller {
        async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
            const httpResponse: HttpResponse = {
                statusCode: 200,
                body: {
                    name: 'any_name'
                }
            }
            return new Promise(resolve => resolve(httpResponse))
        }
    }
    return new ControllerStub()
}

const makeLogErrorRepository = (): LogErrorReposiory => {
    class LogErrorReposioryStub implements LogErrorReposiory {
        async log (stack: string): Promise<void> {
            return new Promise(resolve => resolve())
        }
    }
    return new LogErrorReposioryStub()
}

const makeSut = (): SutTypes => {
    const controllerStub = makeController()
    const logErrorReposioryStub = makeLogErrorRepository()
    const sut = new LogControllerDecoretor(controllerStub, logErrorReposioryStub)
    return {
        sut,
        controllerStub,
        logErrorReposioryStub
    }
}

describe('LogController Decorator', () => {
    test('Should call controller handle', async () => {
        const { sut, controllerStub } = makeSut()
        const handleSpy = jest.spyOn(controllerStub, 'handle')
        const httpRequest = {
            body: {
                email: 'any_mail@mail.com',
                name: 'any_name',
                password: 'any_password',
                passwordConfirmation: 'any_password'
            }
        }
        await sut.handle(httpRequest)
        expect(handleSpy).toHaveBeenCalledWith(httpRequest)
    })

    test('Should return the same result of the controller', async () => {
        const { sut } = makeSut()
        const httpRequest = {
            body: {
                email: 'any_mail@mail.com',
                name: 'any_name',
                password: 'any_password',
                passwordConfirmation: 'any_password'
            }
        }
        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse).toEqual({
            statusCode: 200,
            body : {
                namee: 'any_name'
            }
        })
    })

    test('Should call LogErrorReposiory with correct error if controller returns a server error', async () => {
        const { sut, controllerStub,  logErrorReposioryStub} = makeSut()
        const fakeError = new Error()
        fakeError.stack = 'any_stack'
        const error = serverError(new Error())
        const logSpy = jest.spyOn(logErrorReposioryStub, 'log')
        jest.spyOn(controllerStub, 'handle').mockReturnValueOnce(new Promise(resolve => resolve(error)))
        const httpRequest = {
            body: {
                email: 'any_mail@mail.com',
                name: 'any_name',
                password: 'any_password',
                passwordConfirmation: 'any_password'
            }
        }
        await sut.handle(httpRequest)
        expect(logSpy).toHaveBeenCalledWith('any_stack')
    })
})