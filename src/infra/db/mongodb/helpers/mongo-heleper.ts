import { Collection, MongoClient } from 'mongodb'
import { AccountModel } from '../../../../domain/models/account'

export const MongoHelper = {
    client: null as MongoClient,
    async connect (uri: string): Promise<void> {
      this.client =  await MongoClient.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
    },

    async disconnect () {
        await this.client.close()
    },

    getColletion (name: string): Collection {
        return this.client.db().colletion(name)
    },

    map: (colletion: any): AccountModel => {
        const { _id, ...colletionWithoutId} = colletion
        return Object.assign({}, colletionWithoutId, { id: _id })
    }
}