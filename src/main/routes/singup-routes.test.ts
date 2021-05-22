import request from 'supertest'
import app from '../config/app'

describe('Signup Routes', () => {
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