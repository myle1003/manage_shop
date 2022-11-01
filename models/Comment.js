const mongoose = require('mongoose');
const Joi = require('joi');
const Schema = mongoose.Schema;

//------------ Rate Schema ------------//
const RateSchema = new mongoose.Schema({
    star: {
        type: Number,
        require: true
    }

}, { versionKey: false });

const Rate = mongoose.model('Rate', RateSchema);

function validateRate(rate) {
    const schema = Joi.object({
        star: Joi.number().min(1).max(5).required()
    });
    return schema.validate(rate)
}
exports.RateSchema = RateSchema;
exports.Rate = Rate;
exports.validateRate = validateRate;