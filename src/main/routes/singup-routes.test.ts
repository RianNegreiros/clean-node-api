import request from 'supertest'
import app from '../config/app'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'

describe('Signup Routes', () => {
    
    beforeAll(async () => {
        await MongoHelper.connect(process.env.MONGO_URL)
    })

    afterAll(async () => {
        await MongoHelper.disconnect()
    })

    beforeEach(async () => {
        const accountColletion = MongoHelper.getColletion('accounts')
        accountColletion.deleteMany({})
    })

    test('Should return an account on succes', async () => {
        await request(app)
            .post('/api/signup')
            .send({
                name: '',
                email: '',
                password: '',
                passwordConfirmation: '123'
            })
            .expect(200)
    })
})