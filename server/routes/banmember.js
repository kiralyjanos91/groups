const banMemberRoute = ({
    express,
    MemberModel,
    GroupModel
}) => {
    const router = express.Router()

    router.post("/" , async (req , res) => {

        const { groupId , username } = req.body

        try {

            const thisGroup = await GroupModel.findOne({
                _id: groupId
            })   
            
            const thisMember = await MemberModel.findOne({
                username: username
            })
            
            thisGroup.members = thisGroup.members.filter((member) => member.username !== username)
            thisMember.groups = thisMember.groups.filter((group) => group.group_Id !== groupId)
            
            await thisGroup.save()
            await thisMember.save()
            
            res.status(200).json("Banned")
        }
        catch(err){
            res.status(400).json(err)
        }
    })

    return router
}

module.exports = banMemberRoute