import { SignUpController } from "./signup"
import { InvalidParamError, MissingParamError, ServerError } from "../../errors"
import { EmailValidator, AddAccount, AddAccountModel, AccountModel } from "./signup-protocols"
import { HttpRequest } from "../../protocols"
import { badRequest, ok, serverError } from "../../helpers/http-helpers"
import { Validation } from "../../helpers/validators/validation"

const makeEmailValidator = (): EmailValidator => {
    class EmailVlidatorStub implements EmailValidator {
        isValid(email: string): boolean {
            return true
        }
    }
    return new EmailVlidatorStub()
}

const makeAddAccount = (): AddAccount => {
    class AddAccountStub implements AddAccount {
        async add (account: AddAccountModel): Promise<AccountModel> {
            return new Promise(resolve => resolve(makeFakeAccount()))
        }
    }
    return new AddAccountStub()
}

const makeValidation = (): Validation => {
    class ValidationStub implements Validation {
        validate (input: any): Error {
            return null
        }
    }
    return new ValidationStub()
}

const makeFakeAccount = (): AccountModel => ({
        id: 'valid_id',
        name: 'valid_name',
        email: 'valid_emal@mail.com.br',
        password: 'valid_password',
})

const makeFakeRequest = (): HttpRequest => ({
    body: {
        email: 'any_mail@mail.com',
        name: 'any_name',
        password: 'any_password',
        passwordConfirmation: 'any_password'
    }
})

interface SutTypes {
    sut: SignUpController
    emailValidatorStub: EmailValidator
    addAccountStub: AddAccount
    validationStub: Validation
}

const makeSut = (): SutTypes => {
    const emailValidatorStub = makeEmailValidator()
    const addAccountStub = makeAddAccount()
    const validationStub = makeValidation()
    const sut = new SignUpController(emailValidatorStub, addAccountStub, validationStub)
    return {
        sut,
        emailValidatorStub,
        addAccountStub,
        validationStub
    }
}

describe('SignUp Controller', () => {
    test('Should return 400 if no name is provided', async () => {
        const { sut } = makeSut()
        const httpRequest = {
            body: {
                email: '',
                password: '',
                passwordConfirmation: ''
            }
        }
        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse.body).toEqual(badRequest(new MissingParamError('name')))
    })

    test('Should return 400 if no email is provided', async () => {
        const { sut } = makeSut()
        const httpRequest = {
            body: {
                name: '',
                password: '',
                passwordConfirmation: ''
            }
        }
        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse.body).toEqual(badRequest(new MissingParamError('email')))
    })

    test('Should return 400 if no password is provided', async () => {
        const { sut } = makeSut()
        const httpRequest = {
            body: {
                name: '',
                email: '',
                passwordConfirmation: ''
            }
        }
        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse.body).toEqual(badRequest(new MissingParamError('password')))
    })

    test('Should return 400 if no passwordConfirmation is provided', async () => {
        const { sut } = makeSut()
        const httpRequest = {
            body: {
                name: '',
                email: '',
                password: '',
            }
        }
        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse.body).toEqual(new MissingParamError('passwordConfirmation'))
    })

    test('Should return 400 if no password confirmation fails', async () => {
        const { sut } = makeSut()
        const httpRequest = {
            body: {
                name: '',
                email: '',
                password: '',
                passwordConfirmation: ''
            }
        }
        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse.body).toEqual(badRequest(new InvalidParamError('passwordConfirmation')))
    })

    test('Should return 400 if an invalid email is provided', async () => {
        const { sut, emailValidatorStub } = makeSut()
        jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
        const httpResponse = await sut.handle(makeFakeRequest())
        expect(httpResponse.body).toEqual(badRequest(new InvalidParamError('email')))
    })

    test('Should call EmailValidator with correct email', async () => {
        const { sut, emailValidatorStub } = makeSut()
        const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
        await sut.handle(makeFakeRequest())
        expect(isValidSpy).toHaveBeenCalledWith('')
    })

    test('Should return 500 if EmailValidator throws', async () => {
        const { sut, emailValidatorStub } = makeSut()
        jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
            throw new Error()
        })
        const httpResponse = await sut.handle(makeFakeRequest())
        expect(httpResponse.body).toEqual(serverError(new ServerError(null)))
    })

    test('Should return 500 if AddAccount throws', async () => {
        const { sut, addAccountStub } = makeSut()
        jest.spyOn(addAccountStub, 'add').mockImplementationOnce(async () => {
            return new Promise((resolve, reject) => reject(new Error()))
        })
        const httpResponse = await sut.handle(makeFakeRequest())
        expect(httpResponse.statusCode).toBe(500)
        expect(httpResponse.body).toEqual(serverError(new ServerError(null)))
    })

    test('Should calls AddAccount with correct values', async () => {
        const { sut, addAccountStub } = makeSut()
        const addSpy = jest.spyOn(addAccountStub, 'add')
        const httpRequest = {
            body: {
                name: '',
                email: '',
                password: '',
                passwordConfirmation: ''
            }
        }
        await sut.handle(httpRequest)
        expect(addSpy).toHaveBeenCalledWith({
            name: '',
            email: '',
            password: '',
        })
    })

    test('Should return 200 if valid data is provided', async () => {
        const { sut } = makeSut()
        const httpResponse = await sut.handle(makeFakeRequest())
        expect(httpResponse).toEqual(ok(makeFakeAccount()))
        expect(httpResponse.statusCode).toBe(200)
        expect(httpResponse.body).toEqual(makeFakeAccount())
    })

    test('Should call Validation with correct value', async () => {
        const { sut, validationStub } = makeSut()
        const validateSpy = jest.spyOn(validationStub, 'validate')
        const httpRequest = makeFakeRequest()
        await sut.handle(httpRequest)
        expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
    })
})