const joi = require("joi");
const { emit } = require("nodemon");

const userSchema = joi.object({
    full_name: joi.string().required(),
    email: joi.string().email(),
    contact_no: joi.string().required(),
    address: joi.string().required()
})

function userValidation(req, res, next) {
    const { full_name, email, contact_no, password, role } = req.body;
    const { error } = userSchema.validate({ full_name, email, contact_no, password, role });
    if (error) {
        return res.json("Validation failed for reasons ")
    }
    next()
}

module.exports = userValidation;


