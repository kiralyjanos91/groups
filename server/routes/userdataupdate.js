const express = require("express") 

const userDataUpdateRoute = ({
    express,
    MemberModel
}) => {
    const router = express.Router()
    
    router.get("/" , async (req , res) => {
        const username = req.cookies["groupyxuser"]

        const member = await MemberModel.findOne({ username })
        const userData = {
            username: member.username,
            own_groups: member.own_groups,
            groups: member.groups,
            events: member.events,
            small_photo: member?.photos?.small_photo || ""
        }
        res.status(200).json({ userData })

    })
    
    return router
}

module.exports = userDataUpdateRoute

