const addGroupsRoute = ({
    express,
    GroupModel,
    MemberModel
}) => {
    const router = express.Router()
    router.post("/" , async (req , res) => {
        const { name , username } = req.body
        const newGroup = new GroupModel({
            name,
            admin: username
        })
        try {
            await newGroup.save()
            const memberUpdateResponse = await MemberModel.updateOne({
                username
            } , {
                $push: {
                    own_groups: name
                }
            })
            res.status(200).json(`group added successfully.`)
        }
        catch(err) {
            res.status(400).json(`Failed to add new group. ${err}`)
        }
    })
    return router
}

module.exports = addGroupsRoute