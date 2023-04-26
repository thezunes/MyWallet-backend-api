import { db } from "../app.js"
import { ObjectId } from "mongodb"
import dayjs from "dayjs"


export async function transaction (req, res) { 

    const {name, value, type} = req.body;
    const { authorization } = req.headers;
    const tokenVerify = authorization?.replace("Bearer ", "");
    // console.log(req.headers)
    console.log(authorization)
  
    const isAuth = await db.collection("sessions").findOne({token: tokenVerify})
    const idUser = isAuth?.id;
  
    
    
     if(!isAuth) return res.status(401).send("O usuário não está autorizado a efetuar a ação")
    
      console.log("passou")
  
      
    
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
    console.log("chegou aqui")
    }
    
}
  
export async function transactions(req, res) {
   
  const { token } = req.headers;
  // const transactionsUser = await db.collection("users").find({_id: ObjectId(`${}`)})
  // const transactions = await db.collection("transactions").find(id)
  const userId = await db.collection('sessions').findOne({token: token});
  const newUserID = userId?.id.toString();
  
  if(!userId) return res.status(404).send("Usuário não encontrado")
  
  console.log(newUserID)
  
  try{ 
  
  const allTransactions = await db.collection("transactions").find({id: new ObjectId(`${newUserID}`)}).toArray();
  
  const transactions = allTransactions ? allTransactions : [];
  res.status(200).send({transactions});
  }
  
  catch {
    res.status(401);
  }
}