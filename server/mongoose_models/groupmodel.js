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
    members: {
        type: Array
    },
    admin: {
        type: String
    },
    events: {
        type: Array
    },
    messages: {
        type: Array
    }
})

module.exports = mongoose.model("group" , groupSchema)