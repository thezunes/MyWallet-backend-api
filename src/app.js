import express from "express";
import cors from "cors"
import {MongoClient} from "mongodb"
import dotenv from "dotenv"
import joi from "joi";
import { v4 as uuid } from 'uuid';
import bcrypt from 'bcrypt';
import dayjs from "dayjs";




const app = express()
const token = uuid()

app.use(express.json())
app.use(cors())
dotenv.config()

let db
const mongoClient = new MongoClient(process.env.DATABASE_URL)
mongoClient.connect()
    .then(() => db = mongoClient.db())
    .catch((err) => console.log(err.message))



app.post("/signup", async(req, res) => {
const {name, email, password} = req.body
const userSchema = joi.object({
  name: joi.string().required(),
  email: joi.string().email().required(),
  password: joi.string().min(3).required()
  
  });
const user = {name,email,password}
const encryptedPassword = bcrypt.hashSync(password, 10);
const validation = userSchema.validate(user, { abortEarly: false })
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

})

app.post("/signin", async (req, res) => {
  
  const {email, password} = req.body
  const user = {email,password}
  const userSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().min(3).required()
    });

  const userInfo = await db.collection("users").findOne({email: email})

   const validation = userSchema.validate(user, { abortEarly: false })
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
 
try{

res.status(200).send(token)
await db.collection("sessions").insertOne({id: userInfo._id, token: token})
const teste = db.collection("sessions").findOne({token})
console.log(teste)

}

catch(err) {

  res.status(404).send(err)

}
})
 
app.post("/transaction", async(req, res) => { 

const {name, value, type} = req.body;

// const body = {name: name, value: value, type: "saida"}


const {auth} = req.headers;
const isAuth = await db.collection("sessions").findOne({token: auth})
const idUser = isAuth?.id;

 if(!isAuth) return res.status(401).send("O usuário não está autorizado a efetuar a ação")

const userSchema = joi.object({
  name: joi.string().required(),
  value: joi.number().required(),
  id: joi.required(),
  type: joi.string().valid('entrada','saida').required(),
  date: joi.required()
  });

  const transaction = {name: name, value: value, id: idUser, type: type, date: dayjs().format("DD/MM")}
  console.log(idUser)
  const validation = userSchema.validate(transaction, { abortEarly: false })
if (validation.error) {
   const errors = validation.error.details.map((detail) => detail.message);
   return res.status(422).send(errors);
 }

 
 
try{

 await db.collection("transactions").insertOne(transaction) 
 res.status(200).send("Enviado com sucesso")

}

catch(err){

res.status(404).send(err)

}

})

//  app.listen(process.env.PORT, () => console.log(`Server is Running at port ${process.env.PORT}`))
 app.listen(5002, () => console.log(`Server is Running at port ${process.env.PORT}`))
