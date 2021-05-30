import { Decrypter } from "../../protocols/criptography/Decrypter"
import { DbLoadAccountByToken } from "./db-load-by-token"

describe('DbLoadAccountByToken Usecase', () => {
    test('Should call Decrypter with correct values', async () => {
        class DecrypterStub implements Decrypter {
            async decrypt (value: string): Promise<string> {
                return new Promise(resolve => resolve('any_value'))
            }
        }
        const decrypterStub = new DecrypterStub()
        const decryptSpy = jest.spyOn(decrypterStub, 'decrypt')
        const sut = new DbLoadAccountByToken(decrypterStub)
        await sut.load('any_token')
        expect(decryptSpy).toHaveBeenCalledWith('any_token')
    })
})
