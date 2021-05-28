import { LogErrorRepository } from "../../../../data/protocols/db/log/log-error-repository";
import { MongoHelper } from "../helpers/mongo-helper";

export class LogMongoRepository implements LogErrorRepository {
    async logError (stack: string): Promise<void> {
        const errorColletion = await MongoHelper.getColletion('errors')
        await errorColletion.insertOne({
            stack,
            date: new Date()
        })
    }
}