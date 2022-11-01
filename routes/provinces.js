const express = require('express');
const router = express.Router();

//------------ Importing Controllers ------------//
const provinceController = require('../controllers/provinceController')
    // const router = express.Router({ mergeParams: true });


//------------ create ------------//
router.post('/', provinceController.createProvince);

//------------ get all ------------//
router.get('/', provinceController.getAll);

//------------ get ------------//
router.get('/:id', provinceController.getProvince);

module.exports = router;