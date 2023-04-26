import express from "express";
import cors from "cors"
import {MongoClient, ObjectId} from "mongodb"
import dotenv from "dotenv"
import joi from "joi";
import { v4 as uuid } from 'uuid';
import bcrypt from 'bcrypt';
import dayjs from "dayjs";
import {router} from "./router/index.js"


const app = express()

app.use(express.json())
app.use(cors())
app.use(router)
dotenv.config()

export let db
const mongoClient = new MongoClient(process.env.DATABASE_URL)
mongoClient.connect()
    .then(() => db = mongoClient.db())
    .catch((err) => console.log(err.message))




//  app.listen(process.env.PORT, () => console.log(`Server is Running at port ${process.env.PORT}`))
 app.listen(5000, () => console.log(`Server is Running at port ${process.env.PORT}`))
