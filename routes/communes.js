const express = require('express');
const router = express.Router();

//------------ Importing Controllers ------------//
const communrController = require('../controllers/communeController')


//------------ create ------------//
router.post('/', communrController.createCommune);

//------------ get all ------------//
router.get('/', communrController.getAll);

//------------ get ------------//
router.get('/:id', communrController.getCommuneByIdDistrict);

module.exports = router;