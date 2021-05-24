import { AccountModel, AddAccountModel } from "../../usercases/add-account/db-add-account-protocols";

export interface AddAccountRepository {
    add (accountData: AddAccountModel): Promise<AccountModel>
}