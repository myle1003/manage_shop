const passport = require('passport');
const bcryptjs = require('bcryptjs');
const nodemailer = require('nodemailer');
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const jwt = require('jsonwebtoken');
const JWT_KEY = "jwtactive987";
const JWT_RESET_KEY = "jwtreset987";
const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const sendToken = require("../utils/jwtToken");



//------------ Account Model ------------//
const Account = require('../models/Account');
const User = require('../models/User');

//------------ Register Handle ------------//
exports.registerHandle = (req, res) => {
    const name = (req.body.name);
    const email = (req.body.email).trim().toLowerCase();
    const password = (req.body.password);
    const password2 = (req.body.password2);
    const id_role = 2;

    // const { name, email, password, password2 } = req.body;
    let errors = [];

    //------------ Checking required fields ------------//
    if (!name || !email || !password || !password2) {
        res.status(400).json({
            message: 'Please enter all fields',
            status: false
        });
    }

    //------------ Checking password mismatch ------------//
    if (password != password2) {
        res.status(400).json({
            message: 'Passwords do not match',
            status: false
        });
    }

    //------------ Checking password length ------------//
    if (password.length < 8) {
        res.status(400).json({
            message: 'Password must be at least 8 characters',
            status: false
        });
    }
    if (false) {
        res.status(400).json({
            message: 'Error',
            status: false
        });
    } else {
        //------------ Validation passed ------------//
        // const user1 = User.findOne({ email: email });
        // res.send(user1);
        Account.findOne({ email: email }).then(account => {
            if (account) {
                res.status(400).json({
                    message: 'Email ID already registered',
                    status: false
                });
            } else {
                const oauth2Client = new OAuth2(
                    "173872994719-pvsnau5mbj47h0c6ea6ojrl7gjqq1908.apps.googleusercontent.com", // ClientID
                    "OKXIYR14wBB_zumf30EC__iJ", // Client Secret
                    "https://developers.google.com/oauthplayground" // Redirect URL
                );

                oauth2Client.setCredentials({
                    refresh_token: "1//04T_nqlj9UVrVCgYIARAAGAQSNwF-L9IrGm-NOdEKBOakzMn1cbbCHgg2ivkad3Q_hMyBkSQen0b5ABfR8kPR18aOoqhRrSlPm9w"
                });
                const accessToken = oauth2Client.getAccessToken()

                const token = jwt.sign({ name, email, password }, JWT_KEY, { expiresIn: '30m' });
                const CLIENT_URL = 'http://' + req.headers.host;

                const output = `
                <h2>Please click on below link to activate your account</h2>
                <p>${CLIENT_URL}/api/v1/auth/activate/${token}</p>
                <p><b>NOTE: </b> The above activation link expires in 30 minutes.</p>
                `;

                const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        type: "OAuth2",
                        user: "nodejsa@gmail.com",
                        clientId: "173872994719-pvsnau5mbj47h0c6ea6ojrl7gjqq1908.apps.googleusercontent.com",
                        clientSecret: "OKXIYR14wBB_zumf30EC__iJ",
                        refreshToken: "1//04T_nqlj9UVrVCgYIARAAGAQSNwF-L9IrGm-NOdEKBOakzMn1cbbCHgg2ivkad3Q_hMyBkSQen0b5ABfR8kPR18aOoqhRrSlPm9w",
                        accessToken: accessToken
                    },
                });

                // send mail with defined transport object
                const mailOptions = {
                    from: '"H3M" <nodejsa@gmail.com>', // sender address
                    to: email, // list of receivers
                    subject: "Account Verification: NodeJS Auth ✔", // Subject line
                    generateTextFromHTML: true,
                    html: output, // html body
                };

                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        // console.log(error);
                        // req.flash(
                        //     'error_msg',
                        //     'Something went wrong on our end. Please register again.'
                        // );
                        // res.redirect('/auth/login');
                        res.status(400).json({
                            message: 'Something went wrong on our end. Please register again.',
                            status: false
                        });
                    } else {
                        console.log('Mail sent : %s', info.response);
                        req.flash(
                            'success_msg',
                            'Activation link sent to email ID. Please activate to log in.'
                        );
                        // res.redirect('/auth/login');
                        res.status(200).json({
                            message: 'Activation link sent to email ID. Please activate to log in.',
                            status: true
                        });
                    }
                })

            }
        });
    }
}

//------------ Activate Account Handle ------------//
exports.activateHandle = (req, res) => {
    const token = req.params.token;
    let errors = [];
    if (token) {
        jwt.verify(token, JWT_KEY, (err, decodedToken) => {
            if (err) {
                req.flash(
                    'error_msg',
                    'Incorrect or expired link! Please register again.'
                );
                // res.redirect('/auth/register');
                res.send('Incorrect or expired link! Please register again.');
            } else {

                const id_role = 2;
                const { name, email, password } = decodedToken;
                Account.findOne({ email: email }).then(account => {
                    if (account) {
                        //------------ User already exists ------------//
                        req.flash(
                            'error_msg',
                            'Email ID already registered! Please log in.'
                        );
                        // res.redirect('/auth/login');
                        res.send('Email ID already registered! Please log in.');
                    } else {
                        const newAccount = new Account({
                            name,
                            email,
                            password,
                            id_role
                        });

                        const fullname = "";
                        const id_account = newAccount.id;
                        const phone = "";
                        const gender = true;
                        const address = {
                            id_commune: "",
                            street: ""
                        };


                        const newUser = new User({
                            fullname,
                            id_account,
                            address,
                            phone,
                            gender
                        });
                        newUser.save();

                        bcryptjs.genSalt(10, (err, salt) => {
                            bcryptjs.hash(newAccount.password, salt, (err, hash) => {
                                if (err) throw err;
                                newAccount.password = hash;
                                newAccount
                                    .save()
                                    .then(account => {
                                        req.flash(
                                            'success_msg',
                                            'Account activated. You can now log in.'
                                        );
                                        // res.redirect('/auth/login');
                                        re.send('Account activated. You can now log in.');
                                    })
                                    .catch(err => console.log(err));
                            });
                        });
                    }
                });
            }

        })
    } else {
        console.log("Account activation error!")
    }
}

//------------ Forgot Password Handle ------------//
exports.forgotPassword = (req, res) => {
    const { email } = req.body;

    let errors = [];

    //------------ Checking required fields ------------//
    if (!email) {
        // errors.push({ msg: 'Please enter an email ID' });
        res.status(400).json({
            message: 'Please enter an email ID!',
            status: false
        });
    }

    // if (errors.length > 0) {
    //     res.render('forgot', {
    //         errors,
    //         email
    //     });
    // } 
    if (false) {} else {
        Account.findOne({ email: email }).then(account => {
            if (!account) {
                //------------ User already exists ------------//
                // errors.push({ msg: 'User with Email ID does not exist!' });
                res.status(400).json({
                    message: 'Account with Email ID does not exist!',
                    status: false
                });
                // res.render('forgot', {
                //     errors,
                //     email
                // });
            } else {

                const oauth2Client = new OAuth2(
                    "173872994719-pvsnau5mbj47h0c6ea6ojrl7gjqq1908.apps.googleusercontent.com", // ClientID
                    "OKXIYR14wBB_zumf30EC__iJ", // Client Secret
                    "https://developers.google.com/oauthplayground" // Redirect URL
                );

                oauth2Client.setCredentials({
                    refresh_token: "1//04T_nqlj9UVrVCgYIARAAGAQSNwF-L9IrGm-NOdEKBOakzMn1cbbCHgg2ivkad3Q_hMyBkSQen0b5ABfR8kPR18aOoqhRrSlPm9w"
                });
                const accessToken = oauth2Client.getAccessToken()

                const token = jwt.sign({ _id: account._id }, JWT_RESET_KEY, { expiresIn: '30m' });
                const CLIENT_URL = 'http://' + req.headers.host;
                const output = `
                <h2>Your new account password</h2>
                <p>123456789</p>
                `;
                var password = '123456789';
                bcryptjs.genSalt(10, (err, salt) => {
                    bcryptjs.hash(password, salt, (err, hash) => {
                        if (err) throw err;
                        password = hash;

                        Account.findByIdAndUpdate({ _id: account._id }, { password },
                            function(err, result) {
                                if (err) {
                                    req.flash(
                                        'error_msg',
                                        'Error resetting password!'
                                    );
                                    // res.redirect(`/auth/reset/${id}`);
                                    res.status(400).json({
                                        message: 'Error resetting password!',
                                        status: false
                                    });
                                }
                            });

                    });
                });


                Account.updateOne({ resetLink: token }, (err, success) => {
                    if (err) {
                        // errors.push({ msg: 'Error resetting password!' });
                        // res.render('forgot', {
                        //     errors,
                        //     email
                        // });
                        res.status(400).json({
                            message: 'Error resetting password!',
                            status: false
                        });
                    } else {
                        const transporter = nodemailer.createTransport({
                            service: 'gmail',
                            auth: {
                                type: "OAuth2",
                                user: "nodejsa@gmail.com",
                                clientId: "173872994719-pvsnau5mbj47h0c6ea6ojrl7gjqq1908.apps.googleusercontent.com",
                                clientSecret: "OKXIYR14wBB_zumf30EC__iJ",
                                refreshToken: "1//04T_nqlj9UVrVCgYIARAAGAQSNwF-L9IrGm-NOdEKBOakzMn1cbbCHgg2ivkad3Q_hMyBkSQen0b5ABfR8kPR18aOoqhRrSlPm9w",
                                accessToken: accessToken
                            },
                        });

                        // send mail with defined transport object
                        const mailOptions = {
                            from: '"H3M" <nodejsa@gmail.com>', // sender address
                            to: email, // list of receivers
                            subject: "Account Password Reset: NodeJS Auth ✔", // Subject line
                            html: output, // html body
                        };

                        transporter.sendMail(mailOptions, (error, info) => {
                            if (error) {
                                console.log(error);
                                req.flash(
                                    'error_msg',
                                    'Something went wrong on our end. Please try again later.'
                                );
                                res.status(400).json({
                                    message: 'Something went wrong on our end. Please try again later.',
                                    status: false
                                });
                                // res.redirect('/auth/forgot');
                            } else {
                                console.log('Mail sent : %s', info.response);
                                req.flash(
                                    'success_msg',
                                    'Password reset link sent to email ID. Please follow the instructions.'
                                );
                                // res.redirect('/auth/login');
                                res.status(200).json({
                                    message: 'Password reset link sent to email ID. Please follow the instructions.',
                                    status: true
                                });
                            }
                        })
                    }
                })

            }
        });
    }
}

//------------ Redirect to Reset Handle ------------//
exports.gotoReset = (req, res) => {
    const { token } = req.params;

    if (token) {
        jwt.verify(token, JWT_RESET_KEY, (err, decodedToken) => {
            if (err) {
                req.flash(
                    'error_msg',
                    'Incorrect or expired link! Please try again.'
                );
                // res.redirect('/auth/login');
                res.status(200).json({
                    message: 'Incorrect or expired link! Please try again.',
                    status: false
                });
            } else {
                const { _id } = decodedToken;
                Account.findById(_id, (err, account) => {
                    if (err) {
                        req.flash(
                            'error_msg',
                            'Account with email ID does not exist! Please try again.'
                        );
                        // res.redirect('/auth/login');
                        res.status(400).json({
                            message: 'Account with email ID does not exist! Please try again.',
                            status: false
                        });
                    } else {
                        // res.redirect(`/auth/reset/${_id}`)
                        res.status(200).json({
                            message: 'Succes',
                            id: _id,
                            status: true
                        });
                    }
                })
            }
        })
    } else {
        console.log("Password reset error!")
    }
}


exports.resetPassword = (req, res) => {
    var { password, password2 } = req.body;
    const id = req.params.id;
    let errors = [];

    //------------ Checking required fields ------------//
    if (!password || !password2) {
        req.flash(
            'error_msg',
            'Please enter all fields.'
        );
        // res.redirect(`/auth/reset/${id}`);
        res.status(400).json({
            message: 'Please enter all fields.',
            status: false
        });
    }

    //------------ Checking password length ------------//
    else if (password.length < 8) {
        req.flash(
            'error_msg',
            'Password must be at least 8 characters.'
        );
        // res.redirect(`/auth/reset/${id}`);
        res.status(400).json({
            message: 'Password must be at least 8 characters.',
            status: false
        });
    }

    //------------ Checking password mismatch ------------//
    else if (password != password2) {
        req.flash(
            'error_msg',
            'Passwords do not match.'
        );
        // res.redirect(`/auth/reset/${id}`);
        res.status(400).json({
            message: 'Passwords do not match.',
            status: false
        });
    } else {
        bcryptjs.genSalt(10, (err, salt) => {
            bcryptjs.hash(password, salt, (err, hash) => {
                if (err) throw err;
                password = hash;

                Account.findByIdAndUpdate({ _id: id }, { password },
                    function(err, result) {
                        if (err) {
                            req.flash(
                                'error_msg',
                                'Error resetting password!'
                            );
                            // res.redirect(`/auth/reset/${id}`);
                            res.status(400).json({
                                message: 'Error resetting password!',
                                status: false
                            });
                        } else {
                            req.flash(
                                'success_msg',
                                'Password reset successfully!'
                            );
                            // res.redirect('/auth/login');
                            res.status(200).json({
                                message: 'Password reset successfully!',
                                status: true
                            });
                        }
                    }
                );

            });
        });
    }
}

//------------ Login Handle ------------//
exports.login = (req, res) => {
    try {
        const email = (req.body.email).trim().toLowerCase();
        if (req.body && email && req.body.password) {
            Account.find({ email: email }, (err, data) => {
                if (data.length > 0) {


                    if (bcryptjs.compareSync(req.body.password, data[0].password)) {
                        checkUserAndGenerateToken(data[0], req, res);
                        // const account = Account.findOne({ email }).select("+password");
                        // const account = Account.findOne({ email });
                        // sendToken(account, 200, res);
                    } else {

                        res.status(400).json({
                            message: 'Email or password is incorrect!',
                            status: false
                        });
                    }

                } else {
                    res.status(400).json({
                        message: 'Email or password is incorrect!',
                        token: "",
                        status: false
                    });
                }
            })
        } else {
            res.status(400).json({
                message: 'Add proper parameter first!',
                token: "",
                status: false
            });
        }
    } catch (e) {
        res.status(400).json({
            message: 'Something went wrong!',
            token: "",
            status: false
        });
    }
}

// Login User
exports.loginUser = catchAsyncErrors(async(req, res, next) => {
    const { email, password } = req.body;

    // checking if user has given password and email both

    if (!email || !password) {
        return next(new ErrorHander("Please Enter Email & Password", 400));
    }

    const account = await Account.findOne({ email }).select("+password");
    res.send(account);
    if (!account) {
        return next(new ErrorHander("Invalid email or password", 401));
    }

    // const isPasswordMatched = await account.comparePassword(password);

    // if (!isPasswordMatched) {
    //     return next(new ErrorHander("Invalid email or password", 401));
    // }

    sendToken(account, 200, res);
});

function checkUserAndGenerateToken(data, req, res) {
    jwt.sign({ Account: data.username, id: data._id }, 'shhhhh11111', { expiresIn: '1d' }, (err, token) => {
        if (err) {
            res.status(400).json({
                status: false,
                message: err,
            });
        } else {
            res.json({
                message: 'Login Successfully.',
                token: token,
                status: true
            });
            // const options = {
            //     expires: new Date(
            //         Date.now + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
            //     ),
            //     httpOnly: true,
            // };

            // res.status(200).cookie('token', token, options).json({
            //     success: true,
            //     token,
            // })
        }
    });
}

//------------ Logout Handle ------------//
exports.logoutHandle = (req, res) => {
    req.session.destroy((err) => {
        // res.redirect('/auth/login') // will always fire after session is destroyed
        res.json({
            message: 'Logout Successfully.',
            status: true
        });
    })
}