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
    photos: {
        type: Object
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
    invitations: {
        type: Array
    },
    gender: {
        type: String
    },
    birth: {
        type: String
    },
    location: {
        type: Object
    },
    hobby: {
        type: String
    },
    about: {
        type: String
    }
})

module.exports = mongoose.model("member" , memberSchema)