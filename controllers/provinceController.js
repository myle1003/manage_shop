// const User = require('../models/User');
const { Province, ProvinceSchema, validateProvince } = require('../models/Province')

exports.getAll = async(req, res) => {
    const provinces = await Province.find();
    res.send(provinces);
}

exports.getProvince = async(req, res) => {
    var province = await Province.findById(req.params.id);
    res.send(province);
}

exports.createProvince = async(req, res) => {
    const { error } = validateProvince(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const name = (req.body.name);
    const region = (req.body.region);
    let provinces = await Province.findOne({ name: name });
    if (provinces) return res.status(400).send('Name province already exists');

    let province = new Province({ name: name, region: region });
    province = await province.save();
    res.send(province);
}