const { District, DistrictSchema, validateDistrict } = require('../models/District')

exports.getAll = async(req, res) => {
    const districts = await District.find();
    res.send(districts);
}

exports.getDistrictByIdProvince = async(req, res) => {
    var district = await District.find({ id_province: req.params.id });
    res.send(district);

}

exports.createDistrict = async(req, res) => {
    const { error } = validateDistrict(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const name = (req.body.name);
    const id_province = (req.body.id_province);
    let districts = await District.findOne({ name: name });
    if (districts) return res.status(400).send('Name district already exists');

    let district = new District({ name: name, id_province: id_province });
    district = await district.save();
    res.send(district);
}