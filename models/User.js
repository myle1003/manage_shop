const mongoose = require('mongoose');

//------------ User Schema ------------//
const UserSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    id_account: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    gender: {
        type: Boolean,
        default: false
    },
}, { versionKey: false });

const User = mongoose.model('User', UserSchema);

module.exports = User;