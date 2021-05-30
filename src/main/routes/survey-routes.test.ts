import request from 'supertest'
import app from '../config/app'
import env from '../config/env'
import { Collection } from 'mongodb'
import { sign } from 'jsonwebtoken'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'

let surveyColletion: Collection
let accountColletion: Collection

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
        surveyColletion = await MongoHelper.getColletion('accounts')
        await surveyColletion.deleteMany({})
    })

    describe('POST /surveys', () => {
        test('Should return 403 on add survey without accessToken', async () => {
            await request(app)
                .post('/api/surveys')
                .send({
                    question: 'Question',
                    answers: [{
                        answer: 'Answer 1',
                        immage: 'http://image-name.com'
                    }, {
                        answer: 'Answer 2'
                    }]
                })
                .expect(403)
        })

        test('Should return 204 on add survey with accessToken', async () => {
            const res = await accountColletion.insertOne({
                name: 'Rian',
                email: 'riannegreiros@gmail.com',
                password: '123'
            })
            const id = res.ops[0]._id
            const accessToken = sign({ id }, env.jwtSecret)
            await accountColletion.updateOne({
                _id: id,
            }, {
                $set: {
                    accessToken
                }
            })
            await request(app)
                .post('/api/surveys')
                .set('x-access-token', accessToken)
                .send({
                    question: 'Question',
                    answers: [{
                        answer: 'Answer 1',
                        immage: 'http://image-name.com'
                    }, {
                        answer: 'Answer 2'
                    }]
                })
                .expect(204)
        })
    })
})