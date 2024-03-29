const addGroupsRoute = ({
    express,
    GroupModel,
    MemberModel
}) => {
    const router = express.Router()
    router.post("/" , async (req , res) => {
        const { name , description, user , category , photoLocation } = req.body
        const newGroup = new GroupModel({
            name,
            description,
            category,
            admin: user,
            photo: photoLocation
        })
        try {
            const isNameTaken = await GroupModel.findOne({
                name: name
            })

            if (isNameTaken) {
                return res.status(406).json("Group name is taken")
            }

            const groupSaveResponse = await newGroup.save()
            group_Id = groupSaveResponse._id.toHexString()
            const memberUpdateResponse = await MemberModel.updateOne({
                username: user.username
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