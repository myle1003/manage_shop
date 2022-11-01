const SlugF = require('../config/slug')

const { Discount, DiscSchema, validateDisc } = require('../Models/discount')



exports.getAll = async(req, res) => {
    const discs = await Discount.find();
    res.send(discs);
}

exports.getDiscount = async(req, res) => {
    var disc = await Discount.findById(req.params.id).exec();
    res.send(disc);
}

exports.createDiscount = async(req, res) => {
    const { error } = validateDisc(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const id_product = (req.body.id_product);
    const percent = (req.body.percent);
    const date_start = (req.body.date_start);
    const date_end = (req.body.date_end);
    const status = (req.body.status);

    let disc = new Discount({ id_product: id_product, percent: percent, date_start: date_start, date_end: date_end, status: status });
    disc = await disc.save();
    res.send(disc);
}


exports.updateDiscount = async(req, res) => {
    const { error } = validateDisc(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const id_product = (req.body.id_product);
    const percent = (req.body.percent);
    const date_start = (req.body.date_start);
    const date_end = (req.body.date_end);
    const status = (req.body.status);

    let disc = await Discount.findByIdAndUpdate(req.params.id, { id_product: id_product, percent: percent, date_start: date_start, date_end: date_end, status: status });
    disc = await disc.save();
    disc = await Discount.findById(req.params.id).exec();
    if (!disc) return res.status(404).send('Not availble');
    res.send(disc);
}

exports.deleteDiscount = async(req, res) => {
    const disc = await Discount.findByIdAndDelete(req.params.id);
    if (!disc) return res.status(404).send('Not availble');

    res.send('Success');
}