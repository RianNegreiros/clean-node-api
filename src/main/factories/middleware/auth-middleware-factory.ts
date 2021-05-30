import { AuthMiddleware } from "../../../presentation/middleware/auth-middleware";
import { Middleware } from "../../../presentation/protocols";
import { makeDbLoadAccountByToken } from "../userscases/account/load-account-by-factory/db-load-account-by-factory";

export const makeAuthMiddleware = (role?: string): Middleware => {
    return new AuthMiddleware(makeDbLoadAccountByToken(), role)
}