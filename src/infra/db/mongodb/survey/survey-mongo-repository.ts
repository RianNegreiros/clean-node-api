import { AddSurveyModel, AddSurveyRepository } from "../../../../data/usecases/add-survey/db-add-survey-protocols"
import { MongoHelper } from "../helpers/mongo-helper"

export class SurveyMongoRepository implements AddSurveyRepository {
    async add (surveyData: AddSurveyModel): Promise<void> {
        const surveyColletion = await MongoHelper.getColletion('surveys')
        await surveyColletion.insertOne(surveyData)
    }
}