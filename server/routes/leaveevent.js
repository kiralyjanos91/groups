const leaveEvent = ({
    express,
    GroupModel,
    MemberModel
}) => {
    const router = express.Router()

    router.post("/" , async (req , res) => {
        try{

            const { groupId, eventName, userName } = req.body
            const thisGroup = await GroupModel.findOne({ _id: groupId })
            const thisMember = await MemberModel.findOne({ username: userName })
            const thisEvent = thisGroup.events.find((event) => event.title === eventName)
            
            thisEvent.members = thisEvent.members.filter((member) => member.username !== userName)
            thisMember.events = thisMember.events.filter((event) => event.eventName !== eventName)

            thisGroup.markModified("events")

            await thisGroup.save()
            await thisMember.save()
            
            res.status(200).json("Ok")
        }
        catch(err){
            res.status(400).json(err)
        }
    })

    return router
}

module.exports = leaveEvent