import request from 'supertest'
import app from '../config/app'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import { Collection } from 'mongodb'

let surveyColletion: Collection

describe('Surveys Routes', () => {

    beforeAll(async () => {
        await MongoHelper.connect(process.env.MONGO_URL)
    })

    afterAll(async () => {
        await MongoHelper.disconnect()
    })

    beforeEach(async () => {
        surveyColletion = await MongoHelper.getColletion('surveys')
        await surveyColletion.deleteMany({})
    })

    describe('POST /surveys', () => {
        test('Should return 204 on add survey success', async () => {
            await request(app)
                .post('/api/surveys')
                .send({
                    name: '',
                    email: '',
                    password: '',
                    passwordConfirmation: '123'
                })
                .expect(204)
        })
    })
})