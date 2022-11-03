const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/checkAuth')

//------------ Welcome Route ------------//
router.get('/', (req, res) => {
    res.render('welcome');
});
const auth = require('./auth');
const user = require('./user');
const categories = require('./categories');
const product = require('./product');
const discounts = require('./discounts');
const provinces = require('./provinces');
const districts = require('./districts');
const communes = require('./communes');
var jwt = require('jsonwebtoken');


router.use("/", (req, res, next) => {
    try {
        // if (req.path == "/auth/login" || req.path == "/auth/register" || req.path == "/auth/forgot" || req.path == "/auth/reset" || req.path == "/auth") {
        if (req.path == "/api/v1/cms/") {
            /* decode jwt token if authorized*/
            jwt.verify(req.headers.token, 'shhhhh11111', function(err, decoded) {
                // res.send(decoded.id);

                if (decoded && decoded.id) {
                    req.account = decoded.id;
                    next();

                } else {
                    return res.status(401).json({
                        message: 'User unauthorized!',
                        status: false
                    });
                }
            })
        } else {
            next();
        }

    } catch (e) {
        res.status(400).json({
            errorMessage: 'Something went wrong!',
            status: false
        });
    }
})

router.use('/api/v1/auth', auth);

router.use('/api/v1/cms/user', user);
router.use('/api/v1/cms/categories', categories);
router.use('/api/v1/cms/product', product);
router.use('/api/v1/cms/discounts', discounts);
router.use('/api/v1/cms/provinces', provinces);
router.use('/api/v1/cms/districts', districts);
router.use('/api/v1/cms/communes', communes);



//------------ Dashboard Route ------------//
router.get('/dashboard', ensureAuthenticated, (req, res) => res.render('dash', {
    name: req.user.name
}));

module.exports = router;