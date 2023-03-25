const popularGroupsRoute = ({
    express,
    GroupModel
}) => {
    const router = express.Router()

    router.get("/" , async (req , res) => {

        try {
            const groupsList = await GroupModel.find({})
            const threeMostPopular = groupsList.sort((a,b) => b.members.length - a.members.length).slice(0,4)

            const finalResponse = threeMostPopular.map((group) => {
                return {
                    name: group.name,
                    membersCount: group.members.length,
                    photo: group.photo || ""
                }
            })
            res.status(200).json(finalResponse)
        }
        catch(err) {
            res.status(400).json(err)
        }
    })

    return router
}

module.exports = popularGroupsRoute