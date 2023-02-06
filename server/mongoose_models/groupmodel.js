const mongoose = require("mongoose")

const groupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: "This group name is taken!"
    },
    location: {
        type: String
    },
    category: {
        type: String
    },
    members: {
        type: Array
    },
    admin: {
        type: Object
    },
    events: {
        type: Array
    },
    messages: {
        type: Array
    },
    photo: {
        type: String
    }
})

module.exports = mongoose.model("group" , groupSchema)