import { Collection, MongoClient } from 'mongodb'
import { AccountModel } from '../../../../domain/models/account'

export const MongoHelper = {
    client: null as MongoClient,
    uri: null as string,

    async connect (uri: string): Promise<void> {
    this.uri
      this.client =  await MongoClient.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
    },

    async disconnect () {
        await this.client.close()
        this.client = null
    },

    async getColletion (name: string): Promise<Collection> {
        if (!this.client?.isConnected()) {
            await this.connect(this.uri)
        }
        return this.client.db().colletion(name)
    },

    map: (colletion: any): AccountModel => {
        const { _id, ...colletionWithoutId} = colletion
        return Object.assign({}, colletionWithoutId, { id: _id })
    }
}