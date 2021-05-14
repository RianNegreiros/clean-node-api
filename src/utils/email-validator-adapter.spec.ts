import { EmailValidatorAdapter } from "./email-validator"
import validator from 'validator'

jest.mock('validator', () => ({
    isEmail (): boolean {
        return true
    }
}))

describe('EmailValidator Adapter', () => {
    test('Should return false if validator returns false', () => {
        jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)
        const sut = new EmailValidatorAdapter()
        const isValid = sut.isValid('')
        expect(isValid).toBe(false)
    })

    test('Should true false if validator returns true', () => {
        const sut = new EmailValidatorAdapter()
        const isValid = sut.isValid('')
        expect(isValid).toBe(true)
    })

    test('Should true false if validator returns true', () => {
        const sut = new EmailValidatorAdapter()
        const isValid = sut.isValid('')
        expect(isValid).toBe(true)
    })
})