import joi from "joi";


export const userSchema = joi.object({
    name: joi.string().required(),
    value: joi.number().required(),
    id: joi.required(),
    type: joi.string().valid('entrada','saida').required(),
    date: joi.required()
    });