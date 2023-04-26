import { Router } from "express"
import routes from "./routes.js"

export const router = Router()

router.use(routes)
 
