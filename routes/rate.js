const express = require('express');
const router = express.Router();

//------------ Importing Controllers ------------//
const rateController = require('../controllers/rateController');


router.post('/', rateController.createRate);
router.get('/:id', rateController.getDistrictByIdProvince);
router.get('/', rateController.getAll);
module.exports = router;