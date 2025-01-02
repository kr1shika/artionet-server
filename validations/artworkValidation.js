const joi = require("joi");
const { emit } = require("nodemon");

const artworkSchema = joi.object({
    title: joi.string().required(),
    dimensions: joi.string().email(),
    description: joi.string().required(),
    price: joi.string().required(),
    medium_used: joi.string().required(),
    artistId: joi.string().required(),
    categories: joi.string().required(),

})

function artworkValidation(req, res, next) {
    const { title, dimensions, description, price, medium_used, artistId, categories } = req.body;
    const { error } = artworkSchema.validate({ title, dimensions, description, price, medium_used, artistId, categories });
    if (error) {
        return res.json("Validation failed for reasons ")
    }
    next()
}

module.exports = artworkValidation;


