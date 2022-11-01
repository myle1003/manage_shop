const express = require('express');
const SlugF = require('../config/slug')

const { Category, CateSchema, validateCate } = require('../models/Category')
const router = express.Router({ mergeParams: true });

router.get('/', async(req, res) => {
    const cates = await Category.find();
    res.send(cates);
})

router.get('/:slug', async(req, res) => {

    // var cate = await Category.findById(req.params.id).exec();
    var cate = await Category.findOne({ slug: req.params.idcate })
        // await Category.findOne({ slug: req.params.idcate })
    res.send(cate);
})

router.post('/', async(req, res) => {
    const { error } = validateCate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const name = (req.body.name).trim().toLowerCase();
    let cates = await Category.findOne({ name: name });
    if (cates) return res.status(400).send('Name categiry already exists');

    const sl = await SlugF(req.body.name);
    let cate = new Category({ name: name, slug: sl });
    cate = await cate.save();
    res.send(cate);
})

router.delete('/:id', async(req, res) => {
    const cate = await Category.findByIdAndDelete(req.params.id);
    if (!cate) return res.status(404).send('Not availble');

    res.send('Success');
})

router.put('/:id', async(req, res) => {
    const { error } = validateCate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const name = (req.body.name).trim().toLowerCase();
    let cates = await Category.findOne({ name: name });
    if (cates) return res.status(400).send('Name categiry already exists');

    const sl = await SlugF(req.body.name);
    var cate = await Category.findByIdAndUpdate(req.params.id, { name: name, slug: sl });
    cate = await Category.findById(req.params.id).exec();
    if (!cate) return res.status(404).send('Not availble');
    res.send(cate);
})

module.exports = router;



// const express = require('express');
// const router = express.Router({ mergeParams: true });

// const categoriesController = require('../controllers/categories');

// router.route('/')
//     .get(categoriesController.getAll);

// router.route('/:_id')
//     .get(categoriesController.get);

// module.exports = router;