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
    picture: {
        type: String
    },
    own_groups: {
        type: Array
    },
    groups: {
        type: Array
    },
    private_messages: {
        type: Array
    },
    gender: {
        type: String
    },
    birth: {
        type: String
    },
    city: {
        type: String
    },
    hobby: {
        type: String
    },
    about: {
        type: String
    }
})

module.exports = mongoose.model("member" , memberSchema)