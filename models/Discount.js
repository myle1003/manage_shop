const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { Product } = require('../models/Product');
const DiscSchema = new mongoose.Schema({
    id_product: {
        type: [Schema.Types.ObjectId],
        ref: Product
    },
    percent: {
        type: Number,
        require: true
    },
    date_start: {
        type: Date,
        require: true
    },
    date_end: {
        type: Date,
        require: true
    },
    status: {
        type: Number,
        require: true,
        default: 0,
        enum: [0, 1]
    }
}, { versionKey: false });
const Discount = mongoose.model('Discount', DiscSchema)

function validateDisc(discount) {
    const schema = Joi.object({
        id_product: Joi.array(),
        persent: Joi.required(),
        date_start: Joi.required(),
        date_end: Joi.required(),
        status: Joi.required()
    });
    return schema.validate(discount)
}
exports.DiscSchema = DiscSchema;
exports.Discount = Discount;
exports.validateDisc = validateDisc;