const findMemberRoute = ({
    express,
    MemberModel
}) => {
    const router = express.Router()

    router.get("/" , async (req , res) => {

        const membersListRaw = await MemberModel.find({})

        const { memberletters } = req.query

        const filteredList = membersListRaw.filter((member) => member.username.startsWith(memberletters))
        const membersList = filteredList.map((member) => {
            return {
                username: member.username,
                small_photo: member.photos?.small_photo
            }
        })
    
        res.status(200).json(membersList)
    })

    return router
}

module.exports = findMemberRoute