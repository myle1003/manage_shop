const Joi = require('joi');
const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
        minlength: 2,
        maxlength: 100,
        unique: true
    },
}, { versionKey: false });
const Product = mongoose.model('Product', ProductSchema)

function validateProduct(product) {
    const schema = Joi.object({
        name: Joi.string().min(2).max(100).required()
    });
    return schema.validate(product)
}
exports.ProductSchema = ProductSchema;
exports.Product = Product;
exports.validateProduct = validateProduct;