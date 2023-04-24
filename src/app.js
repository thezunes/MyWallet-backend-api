import express from "express";
import cors from "cors"
import {MongoClient} from "mongodb"
import dotenv from "dotenv"
import joi from "joi";
import { v4 as uuid } from 'uuid';
import bcrypt from 'bcrypt';




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

const userSchema = joi.object({
name: joi.string().required(),
email: joi.string().email().required(),
password: joi.string().min(3).required()

});

app.post("/signup", async(req, res) => {
const {name, email, password} = req.body
const user = {name,email,password}
const encryptedPassword = bcrypt.hashSync(password, 10);
const validation = userSchema.validate(user, { abortEarly: false })
 if (validation.error) {
    const errors = validation.error.details.map((detail) => detail.message);
    return res.status(422).send(errors);
  }

  
try {
const newUser = {name: name,email: email,password: encryptedPassword}
const isRegistered = db.collection("users").findOne({email: email})

if(isRegistered){ return res.status(409).send("Email já cadastrado")} 
res.sendStatus(201)
db.collection("users").insertOne(newUser)
}
catch(err){
res.status(401).send(err)

}

})




 app.listen(process.env.PORT, () => console.log(`Server is Running at port ${process.env.PORT}`))
