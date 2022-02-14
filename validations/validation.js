const joi = require('joi')

const registerValidation = (data) =>{
    const schemaValidation = joi.object({
        username:joi.string().require().min(2).max(256)
    })
    return schemaValidation.validate(data)
}