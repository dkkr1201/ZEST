const Joi = require('joi');

module.exports.productSchema = Joi.object({
    name: Joi.string().required(),
    image:Joi.string().required(),
    price: Joi.number().min(0).required(),
    desc: Joi.string().required()
});

module.exports.reviewSchema = Joi.object({});

