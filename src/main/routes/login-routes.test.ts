import request from 'supertest'
import app from '../config/app'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import { Collection } from 'mongodb'
import { hash } from 'bcrypt'

let accountColletion: Collection

describe('Signup Routes', () => {

    beforeAll(async () => {
        await MongoHelper.connect(process.env.MONGO_URL)
    })

    afterAll(async () => {
        await MongoHelper.disconnect()
    })

    beforeEach(async () => {
        accountColletion = await MongoHelper.getColletion('accounts')
        await accountColletion.deleteMany({})
    })

    describe('POST /signup', () => {
        test('Should return an account on success', async () => {
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

    describe('POST /login', () => {
        test('Should return 200 on login', async () => {
            const password = await hash('123', 12)
            await accountColletion.insertOne({
                name: 'Rian',
                email: 'riannegreiros@gmail.com',
                password
            })
            await request(app)
                .post('/api/login')
                .send({
                    email: 'riannegreiros@gmail.com',
                    password: '123'
                })
                .expect(200)
        })

        test('Should return 401 on login', async () => {
            await request(app)
            .post('/api/login')
            .send({
                email: 'riannegreiros@gmail.com',
                password: '123'
            })
            .expect(401)
        })
    })
})