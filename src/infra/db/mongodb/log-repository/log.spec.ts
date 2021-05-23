import { MongoHelper } from "../helpers/mongo-helper"
import { Collection } from 'mongodb'
import { LogMongoRepository } from "./log"

describe('Log Mongo Repository', () => {
    let errorColletion: Collection

    beforeAll(async () => {
        await MongoHelper.connect(process.env.MONGO_URL)
    })

    afterAll(async () => {
        await MongoHelper.disconnect()
    })

    beforeEach(async () => {
        const accountColletion = await MongoHelper.getColletion('accounts')
        accountColletion.deleteMany({})
    })

    test('Should create an error log on success', async () => {
        const sut = new LogMongoRepository()
        await sut.logError('any_error')
        const count = await errorColletion.countDocuments()
        expect(count).toBe(1)
    })
})