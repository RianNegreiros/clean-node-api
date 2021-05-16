import { EmailValidatorAdapter } from "./email-validator-adapter"
import validator from 'validator'

jest.mock('validator', () => ({
    isEmail (): boolean {
        return true
    }
}))

const makeSut = (): EmailValidatorAdapter => {
    return new EmailValidatorAdapter()
}

describe('EmailValidator Adapter', () => {
    test('Should return false if validator returns false', () => {
        jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)
        const sut = makeSut()
        const isValid = sut.isValid('')
        expect(isValid).toBe(false)
    })

    test('Should true false if validator returns true', () => {
        const sut = makeSut()
        const isValid = sut.isValid('')
        expect(isValid).toBe(true)
    })

    test('Should call validator with correct email', () => {
        const sut = makeSut()
        const isEmailSpy = jest.spyOn(validator, 'isEmail')
        const isValid = sut.isValid('')
        expect(isEmailSpy).toHaveBeenCalledWith(isValid)
    })
})