const addGroupsRoute = ({
    express,
    GroupModel,
    MemberModel
}) => {
    const router = express.Router()
    router.post("/" , async (req , res) => {
        const { name , username , category } = req.body
        const newGroup = new GroupModel({
            name,
            category,
            admin: username
        })
        try {
            const groupSaveResponse = await newGroup.save()
            group_Id = groupSaveResponse._id.toHexString()
            const memberUpdateResponse = await MemberModel.updateOne({
                username
            } , {
                $push: {
                    own_groups: {
                        name,
                        group_Id
                    }
                }
            })
            res.status(200).json({group_Id})
        }
        catch(err) {
            res.status(400).json(`Failed to add new group. ${err}`)
        }
    })
    return router
}

module.exports = addGroupsRoute