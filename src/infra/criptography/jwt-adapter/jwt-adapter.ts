import jwt from 'jsonwebtoken'
import { Encrypter } from '../../../data/protocols/criptography/encrypter';

export class JwtAdapter implements Encrypter {
    constructor(
        private readonly secret: string
        ) { }

    async encrypt(value: string): Promise<string> {
        const accessToken = await jwt.sign({ id: value }, this.secret)
        return accessToken
    }

    async decrypt(token: string): Promise<string> {
        const value = await jwt.verify(token, this.secret)
        return value
    }
}