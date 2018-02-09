var mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        unique: true,
        lowercase: true,
        required: true
    },

    password: {
        type: String,
        required: true
    },

    email: {
        type: String,
        lowercase: true,
        required: true
    }
})

module.exports = mongoose.model('User', userSchema);