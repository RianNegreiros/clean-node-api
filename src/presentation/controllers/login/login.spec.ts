import { MissingParamError } from "../../errors"
import { badRequest } from "../../helpers/http-helpers"
import { LoginController } from "./login"

describe('login Controller', () => {
    test('Should return 400 if no email is provided', async () => {
        const sut = new LoginController()
        const httpRequest = {
            body: {
                password: 'any_password'
            }
        }

        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
    })
})