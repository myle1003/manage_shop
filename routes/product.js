const express = require('express');
const SlugF = require('../config/slug')

const { Product, ProductSchema, validateProduct } = require('../models/Product')
const router = express.Router({ mergeParams: true });

router.get('/', async(req, res) => {
    const pro = await Product.find();
    res.send(pro);
})

router.post('/', async(req, res) => {
    const { error } = validateProduct(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const name = (req.body.name).trim().toLowerCase();
    let pros = await Product.findOne({ name: name });
    if (pros) return res.status(400).send('Name categiry already exists');

    // const sl = await SlugF(req.body.name);
    let pro = new Product({ name: name });
    pro = await pro.save();
    res.send(pro);
})



module.exports = router;