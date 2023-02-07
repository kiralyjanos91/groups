const memberDataRoute = ({
    express, 
    MemberModel
}) => {
    const router = express.Router()

    router.post("/" , async (req , res) => {
        const { membername } = req.body
        try{
            const member = await MemberModel.findOne({ username: membername})
            const { 
                username,
                own_groups,
                groups,
                gender,
                birth,
                city,
                hobby,
                about 
            } = member

            const memberData = {
                username,
                own_groups,
                groups,
                gender,
                birth,
                city,
                hobby,
                about,
                photo: member.photo || "",
                small_photo: member.small_photo || ""
            }
            res.status(200).json(memberData)
        }
        catch(e) {
            res.status(500).json(e)
        }
    })
    return router
}

module.exports = memberDataRoute