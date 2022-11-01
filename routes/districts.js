const express = require('express');
const router = express.Router();

//------------ Importing Controllers ------------//
const districtController = require('../controllers/districtController');
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");


//------------ create ------------//
router.post('/', districtController.createDistrict);

//------------ get disttric by id province ------------//
router.get('/:id', districtController.getDistrictByIdProvince);

//------------ get all ------------//
router.get('/', districtController.getAll);
// router.route("/").get(isAuthenticatedUser, districtController.getAll);

//------------ get ------------//
// router.get('/:id', districtController.getDistrict);

module.exports = router;