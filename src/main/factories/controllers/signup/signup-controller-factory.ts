import { SignUpController } from "../../../../presentation/controllers/signup/signup-controller";
import { Controller } from "../../../../presentation/protocols";
import { makeLogControllerDecorator } from "../../decorators/log-controller-decorator-factory";
import { makeDbAddAccount } from "../../userscases/add-account/db-add-account-factory";
import { makeDbAuthentication } from "../../userscases/authentication/db-authentication-factory";
import { makeSignUpValidation } from "./singup-validation-factory";

export const makeSignUpController = (): Controller => {
    return makeLogControllerDecorator(new SignUpController(makeDbAddAccount(), makeSignUpValidation(), makeDbAuthentication()))
}