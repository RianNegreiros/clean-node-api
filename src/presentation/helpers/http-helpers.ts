import { HttpResponse } from "../protocols"
import { ServerError } from '../errors'

export const badRequest = (error: Error): HttpResponse => {
    return {
        statusCode: 400,
        body: error
    }
}

export const serverError = (): HttpResponse => {
    return {
        statusCode: 500,
        body: new ServerError()
    }
}

export const ok = (data: any): HttpResponse => ({
    statusCode: 200,
    body: data
})