const Joi = require('joi');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { Province } = require('./Province');
Joi.objectId = require('joi-objectid')(Joi);

const DistrictSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
        minlength: 2,
        maxlength: 100,
        unique: true
    },
    id_province: {
        type: Schema.Types.ObjectId,
        ref: Province
    }
}, { versionKey: false });
const District = mongoose.model('District', DistrictSchema)

function validateDistrict(district) {
    const schema = Joi.object({
        name: Joi.string().min(2).max(100).required(),
        id_province: Joi.objectId()
    });
    return schema.validate(district)
}
exports.DistrictSchema = DistrictSchema;
exports.District = District;
exports.validateDistrict = validateDistrict;