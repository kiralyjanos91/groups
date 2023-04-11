const joinToEvent = ({
    express,
    GroupModel,
    MemberModel
}) => {
    const router = express.Router()

    router.post("/" , async (req , res) => {
        const {
            groupId,
            groupName,
            eventName,
            eventPhoto,
            eventDate,
            eventTime,
            eventLocation,
            username,
            userPhoto
        } = req.body

        const thisMember = await MemberModel.findOne({username: username})
        const thisGroup = await GroupModel.findOne({_id: groupId})
        const thisEvent = thisGroup.events.find(event =>
            event.title === eventName
        )

        const isJoined = thisEvent.members.find((member) => member.username === username)

        if (isJoined) {
            res.status(400).json("Already Joined!")
        }
        else {
            try {

                thisEvent.members.push({
                    username,
                    userPhoto
                })
                
                thisMember.events.push({
                    eventName,
                    eventPhoto,
                    eventDate,
                    eventTime,
                    eventLocation,
                    groupName,
                    groupId
                })
                
                thisGroup.markModified("events")
                await thisMember.save()
                await thisGroup.save()
                
                res.status(200).json("Joined")
            }
            catch(err){
                res.status(400).json(err)
            }
        }
    })

    return router
}

module.exports = joinToEvent