import { Validation } from "../../../../presentation/protocols/validation"
import { ValidationComposite, RequiredFieldValidation } from "../../../../presentation/helpers/validators"
import { makeAddSurveyValidation } from "./add-survey-validation-factory"

jest.mock('../../../presentation/helpers/validators/validation-composite')

describe('AddSurveyValidation Factory', () => {
    test('Should call ValidationComposite with all validations', () => {
        makeAddSurveyValidation()
        const validations: Validation[] = []
        for (const field of ['question', 'answers']) {
            validations.push(new RequiredFieldValidation(field))
        }
        expect(ValidationComposite).toHaveBeenCalledWith(validations)
    })
})