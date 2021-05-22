import { Express } from 'express'
import { bodyParser } from '../middlewares'
import { cors } from '../middlewares/cors'
import { contentType } from '../middlewares'

export default (app: Express): void => {
    app.use(bodyParser)
    app.use(cors)
    app.use(contentType)
}