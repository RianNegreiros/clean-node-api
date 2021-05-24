import { AccountModel } from "../../usercases/add-account/db-add-account-protocols";

export interface LoadAccountByEmailRepository {
    load (email: string): Promise<AccountModel>
}