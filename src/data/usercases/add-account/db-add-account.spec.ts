import { Hasher } from "./db-add-account-protocols"
import { DbAddAccount } from "./db-add-account"
import { AccountModel } from "../../../domain/models/account"
import { AddAccountModel } from "../../../domain/usercases/add-account"
import { AddAccountRepository } from "../../protocols/db/account/add-account-repository"

const makeHasher = (): Hasher => {
    class HasherStub {
        async hash(value: string): Promise<string> {
            return new Promise(resolve => resolve('hashed_password'))
        }
    }
    return new HasherStub()
}

const makeAddAccountRepository = (): AddAccountRepository => {
    class AddAccountRepositoryStub implements AddAccountRepository {
        async add(accountData: AddAccountModel): Promise<AccountModel> {
            return new Promise(resolve => resolve(makeFakeAccount()))
        }
    }
    return new AddAccountRepositoryStub()
}

const makeFakeAccount = (): AccountModel => ({
    id: 'valid_id',
    name: 'valid_name',
    email: 'valid_emal@mail.com.br',
    password: 'hashed_password',
})

const makeFakeAccountData = (): AddAccountModel => (
    {
        name: 'valid_name',
        email: 'valid_email',
        password: 'valid_password'
    }
)

interface SutTypes {
    sut: DbAddAccount
    hasherStub: Hasher
    addAccountRepositoryStub: AddAccountRepository
}

const makeSut = (): SutTypes => {
    const hasherStub = makeHasher()
    const addAccountRepositoryStub = makeAddAccountRepository()
    const sut = new DbAddAccount(hasherStub, addAccountRepositoryStub)
    return {
        sut,
        hasherStub,
        addAccountRepositoryStub
    }
}

describe('DbAddAccount Usercase', () => {
    test('Should call Hasher with correct password', async () => {
        const { sut, hasherStub } = makeSut()
        const encryptSpy = jest.spyOn(hasherStub, 'hash')
        await sut.add(makeFakeAccountData())
        expect(encryptSpy).toHaveBeenCalledWith('valid_password')
    })

    test('Should throw if Hasher throws', async () => {
        const { sut, hasherStub } = makeSut()
        jest.spyOn(hasherStub, 'hash').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
        const promise = sut.add(makeFakeAccountData())
        expect(promise).rejects.toThrow()
    })

    test('Should call AddAccountRepository with correct values', async () => {
        const { sut, addAccountRepositoryStub } = makeSut()
        const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')
        await sut.add(makeFakeAccountData())
        expect(addSpy).toHaveBeenCalledWith({
            name: 'valid_name',
            email: 'valid_email',
            password: 'hashed_password'
        })
    })

    test('Should throw if AddAccountRepository throws', async () => {
        const { sut, addAccountRepositoryStub } = makeSut()
        jest.spyOn(addAccountRepositoryStub, 'add').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
        const promise = await sut.add(makeFakeAccountData())
        expect(promise).rejects.toThrow()
    })

    test('Should return an account on success', async () => {
        const { sut } = makeSut()
        const account = await sut.add(makeFakeAccountData())
        expect(account).toEqual(makeFakeAccount())
    })
})