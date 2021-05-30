import { Validation } from "../../../../../presentation/protocols/validation"
import { ValidationComposite, RequiredFieldValidation, CompareFieldValidation, EmailValidation } from "../../../../../presentation/helpers/validators"
import { EmailValidator } from "../../../../../presentation/protocols"
import { makeSignUpValidation } from "./singup-validation-factory"

jest.mock('../../../presentation/helpers/validators/validation-composite')

const makeEmailValidator = (): EmailValidator => {
    class EmailValidatorStub implements EmailValidator {
        isValid(email: string): boolean {
            return true
        }
    }
    return new EmailValidatorStub()
}

describe('SignUpValidation Factory', () => {
    test('Should call ValidationComposite with all validations', () => {
        makeSignUpValidation()
        const validations: Validation[] = []
        for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
            validations.push(new RequiredFieldValidation(field))
        }
        validations.push(new CompareFieldValidation('password', 'passwordConfirmation'))
        validations.push(new EmailValidation('email', makeEmailValidator()))
        expect(ValidationComposite).toHaveBeenCalledWith(validations)
    })
})