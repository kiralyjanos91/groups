const mongoose = require("mongoose")

const memberSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: 'This username is taken!'
    },
    password: {
        type: String,
        required: true
    },
    groups: {
        type: Array
    },
    private_messages: {
        type: Array
    }
})

module.exports = mongoose.model("member" , memberSchema)