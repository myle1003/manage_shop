const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require("jsonwebtoken");
const Account = require("../models/Account");


exports.isAuthenticatedUser = catchAsyncErrors(async(req, res, next) => {

    const { token } = req.cookies;

    res.send(token);

    if (!token) {
        return next(new ErrorHander("Please Login to access this resource", 401));
    }

    const decodeData = jwt.verify(token, process.env.JWT_SECRET);

    req.account = await Account.findById(decodeData.id);

    next();
})

exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.account.role)) {
            return next(new ErrorHander(`Role: ${req.account.role} is not allowed to access this resource`, 403));
        }
        next();
    }
}