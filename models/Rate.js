const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { Product } = require('../models/Product');
const User = require('./User');



//------------ Rate Schema ------------//
const RateSchema = new mongoose.Schema({
    star: {
        type: Number,
        require: true
    },
    id_product: {
        type: [Schema.Types.ObjectId],
        ref: Product
    },
    id_user: {
        type: [Schema.Types.ObjectId],
        ref: User
    }


}, { versionKey: false });

const Rate = mongoose.model('Rate', RateSchema);

function validateRate(rate) {
    const schema = Joi.object({
        star: Joi.number().min(1).max(5).required(),
        id_product: Joi.objectId(),
        id_user: Joi.objectId()

    });
    return schema.validate(rate)
}
exports.RateSchema = RateSchema;
exports.Rate = Rate;
exports.validateRate = validateRate;