const Joi = require('joi');
const mongoose = require('mongoose');

const ProvinceSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
        minlength: 2,
        maxlength: 100,
        unique: true
    },
    region: {
        type: String,
        require: true,
        minlength: 2,
        maxlength: 100
    }
}, { versionKey: false });
const Province = mongoose.model('Province', ProvinceSchema)

function validateProvince(province) {
    const schema = Joi.object({
        name: Joi.string().min(2).max(100).required(),
        region: Joi.string().min(2).max(100).required()
    });
    return schema.validate(province)
}
exports.ProvinceSchema = ProvinceSchema;
exports.Province = Province;
exports.validateProvince = validateProvince;