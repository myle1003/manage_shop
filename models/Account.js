const mongoose = require('mongoose');

//------------ Account Schema ------------//
const AccountSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    id_role: {
        type: String,
        required: true
    },
    verified: {
        type: Boolean,
        default: false
    },
    resetLink: {
        type: String,
        default: ''
    }
}, { timestamps: true }, { versionKey: false });

const Account = mongoose.model('Account', AccountSchema);

module.exports = Account;