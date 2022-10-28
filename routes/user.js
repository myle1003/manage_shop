const express = require('express');
const router = express.Router();

//------------ Importing Controllers ------------//
const userController = require('../controllers/userController')

//------------ create ------------//
router.post('/', userController.createUser);

//------------ update ------------//
router.put('/:id', userController.updateUser);

//------------ get ------------//
router.get('/:id', userController.getUser);

//------------ get ------------//
router.delete('/:id', userController.deleteUser);

module.exports = router;