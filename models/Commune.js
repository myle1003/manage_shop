const Joi = require('joi');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { District } = require('./District');
Joi.objectId = require('joi-objectid')(Joi);

const CommuneSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
        minlength: 2,
        maxlength: 100,
        unique: true
    },
    id_district: {
        // type: String
        type: Schema.Types.ObjectId,
        ref: District
    }
}, { versionKey: false });
const Commune = mongoose.model('Commune', CommuneSchema)

function validateCommune(commune) {
    const schema = Joi.object({
        name: Joi.string().min(2).max(100).required(),
        id_district: Joi.objectId()
    });
    return schema.validate(commune)
}
exports.CommuneSchema = CommuneSchema;
exports.Commune = Commune;
exports.validateCommune = validateCommune;