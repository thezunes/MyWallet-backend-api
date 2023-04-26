import { Router } from "express"
import { userSchemaSignUp, userSchemaSignIn } from "../schemas/auth-schemas.js"
import { userSchema } from "../schemas/transaction.schemas.js"
import { signin, signup } from "../controllers/auth.js"
import { transaction, transactions } from "../controllers/transactions.js"
 
const routerAuth = Router()

//AUTH

routerAuth.post("/signin", signin)
routerAuth.post("/signup", signup)

// validateSchema(userSchemaSignUp)
// validateSchema(userSchemaSignIn)

//TRANSACTIONS

routerAuth.post("/transaction", transaction)
routerAuth.get("/transactions", transactions)


// validateSchema(userSchema) validar token
// validateSchema(userSchema) validar token

// authRouter.post("/logout", authValidation, logout)


export default routerAuth