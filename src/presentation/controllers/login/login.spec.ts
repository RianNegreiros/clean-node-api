import { ok, serverError, unauthorized } from "../../helpers/http/http-helpers"
import { HttpRequest, Authentication } from "./login-protocols"
import { LoginController } from "./login"
import { Validation } from "../signup/signup-protocols"
import { AuthenticationModel } from "../../../domain/usercases/authentication"

const makeAuthentication = (): Authentication => {
    class AuthenticationStub implements Authentication {
        async auth (authentication: AuthenticationModel): Promise<string> {
            return new Promise(resolve => resolve('any_token'))
        }
    }
    return new AuthenticationStub()
}

const makeValidation = (): Validation => {
    class ValidationStub implements Validation {
        validate (input: any): Error {
            return null
        }
    }
    return new ValidationStub()
}

const makeFakeRequest = (): HttpRequest => ({
    body: {
        email: 'any_email@mail.com',
        password: 'any_password'
    }
})

interface SutTypes {
    sut: LoginController
    validationStub: Validation
    authenticationStub: Authentication
}

const makeSut = (): SutTypes => {
    const validationStub = makeValidation()
    const authenticationStub = makeAuthentication()
    const sut = new LoginController(authenticationStub, validationStub)
    return {
        sut,
        validationStub,
        authenticationStub
    }
}

describe('login Controller', () => {
    test('Should call Authentication with correct values', async () => {
        const { sut, authenticationStub } = makeSut()
        const authSpy = jest.spyOn(authenticationStub, 'auth')
        await sut.handle(makeFakeRequest())
        expect(authSpy).toHaveBeenCalledWith({
            email: 'any_email@mail.com', 
            password:'any_password'
        })
    })

    test('Should return 401 if invalid credentials are provided', async () => {
        const { sut, authenticationStub } = makeSut()
        jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(new Promise(resolve => resolve(null)))
        const httpResponse = await sut.handle(makeFakeRequest())
        expect(httpResponse).toEqual(unauthorized())
    })

    test('Should return 500 if Authentication throws', async () => {
        const { sut, authenticationStub } = makeSut()
        jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
        const httpResponse = await sut.handle(makeFakeRequest())
        expect(httpResponse).toEqual(serverError(new Error()))
    })

    test('Should return 200 if valid credentials are provided', async () => {
        const { sut } = makeSut()
        const httpResponse = await sut.handle(makeFakeRequest())
        expect(httpResponse).toEqual(ok({ accessToken: 'any_token' }))
    })
})