import { AddAccountRepository } from "../../../../data/protocols/db/account/add-account-repository";
import { LoadAccountByEmailRepository } from "../../../../data/protocols/db/account/load-account-by-email-repository";
import { UpdateAccessTokenRepository } from "../../../../data/protocols/db/account/update-access-token-repository";
import { AccountModel } from "../../../../domain/models/account";
import { AddAccountModel } from "../../../../domain/usecases/add-account";
import { MongoHelper } from "../helpers/mongo-helper";

export class AccountMongoRepository implements AddAccountRepository, LoadAccountByEmailRepository, UpdateAccessTokenRepository {
    async add (accountData: AddAccountModel): Promise<AccountModel> {
        const accountCollection = await MongoHelper.getColletion('accounts')
        const result = await accountCollection.insertOne(accountData)
        return MongoHelper.map(result.ops[0])
    }
    async loadByEmail (email: string): Promise<AccountModel> {
        const accountColletion = await MongoHelper.getColletion('accounts')
        const account = await accountColletion.findOne({ email })
        return account && MongoHelper.map(account)
    }

    async updateAccessToken(id: string, token: string): Promise<void> {
        const accountColletion = await MongoHelper.getColletion('accounts')
        await accountColletion.updateOne({ 
            _id: id 
        }, {
            $set: {
                accessToken: token
            }
        })
    }
}