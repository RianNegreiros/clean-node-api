import { AddAccountRepository } from "../../../../data/protocols/add-account-repository";
import { AccountModel } from "../../../../domain/models/account";
import { AddAccountModel } from "../../../../domain/usercases/add-account";
import { MongoHelper } from "../helpers/mongo-helper";

export class AccountMongoRepository implements AddAccountRepository {
    async add (accountData: AddAccountModel): Promise<AccountModel> {
        const accountCollection = await MongoHelper.getColletion('accounts')
        const result = await accountCollection.insertOne(accountData)
        return MongoHelper.map(result.ops[0])
    }
}