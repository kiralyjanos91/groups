const findMemberRoute = ({
    express,
    MemberModel
}) => {
    const router = express.Router()

    router.get("/" , async (req , res) => {

        try {
            const membersListRaw = await MemberModel.find({})       
            const { memberletters , currentPartners } = req.query
            const noCurrentPartnersList = membersListRaw.filter((member) => !currentPartners.includes(member.username))
            const filteredList = noCurrentPartnersList.filter((member) => member.username.toLowerCase().startsWith(memberletters.toLowerCase()))
            const membersList = filteredList.map((member) => {
                return {
                    username: member.username,
                    small_photo: member.photos?.small_photo
                }
            })
            
            res.status(200).json(membersList)
        }
        catch(err){
            res.status(400).json(`Something went wrong. ${err}`)
        }
    })

    return router
}

module.exports = findMemberRoute