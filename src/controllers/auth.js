import bcrypt from "bcrypt"
import { db } from "../app.js"
import { v4 as uuid } from "uuid"
import joi from "joi"
import { userSchemaSignIn, userSchemaSignUp } from "../schemas/auth-schemas.js"





export async function signup(req, res) {
    const {name, email, password} = req.body
    const user = {name,email,password}
    const encryptedPassword = bcrypt.hashSync(password, 10);
    const validation = userSchemaSignUp.validate(user, { abortEarly: false })
     if (validation.error) {
        const errors = validation.error.details.map((detail) => detail.message);
        return res.status(422).send(errors);
      }
    
      
    try {
    const newUser = {name: name,email: email,password: encryptedPassword}
    const isRegistered = await db.collection("users").findOne({email: email}) 
    if(isRegistered){ return res.status(409).send("Email já cadastrado")} 
    res.sendStatus(201)
    db.collection("users").insertOne(newUser)
    }
    catch(err){
    res.status(401).send(err.message)
    
    }
    
    }
    
export async function signin(req, res) {
      console.log("entrou função")
      const {email, password} = req.body
      const user = {email,password}
      const token = uuid()
      const userInfo = await db.collection("users").findOne({email: email})
      const infoAuth = {token: token, name: userInfo.name}

    
      const validation = userSchemaSignIn.validate(user, { abortEarly: false })
      if (validation.error) {
         const errors = validation.error.details.map((detail) => detail.message);
         return res.status(422).send(errors);
       }
    
       const isRegistered = await db.collection("users").findOne({email: email})
       if(!isRegistered) return res.status(404).send("Usuário não cadastrado")
    
       const userDate  = await db.collection("users").findOne({email: email})
       const auth = await bcrypt.compare(password, userDate.password)
       console.log(userInfo)
       if(!auth) return res.status(401).send("Senha incorreta")
       console.log("passou")
    try{
    
    res.status(200).send(infoAuth)
    await db.collection("sessions").insertOne({id: userInfo._id, token: token})
    const teste = db.collection("sessions").findOne({token})
    console.log(teste)
    
    }
    
    catch(err) {
    
      res.status(404).send(err)
        console.log(err)
    }
}
