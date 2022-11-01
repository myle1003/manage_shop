const { Commune, CommuneSchema, validateCommune } = require('../models/Commune')


exports.getAll = async(req, res) => {
    const communes = await Commune.find();
    res.send(communes);
}

exports.getCommuneByIdDistrict = async(req, res) => {
    const communes = await Commune.find({ id_district: req.params.id });
    res.send(communes);
}

exports.createCommune = async(req, res) => {
    const { error } = validateCommune(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const name = (req.body.name);
    const id_district = (req.body.id_district);
    let communes = await Commune.findOne({ name: name });
    if (communes) return res.status(400).send('Name district already exists');

    let commune = new Commune({ name: name, id_district: id_district });
    commune = await commune.save();
    res.send(commune);
}