const deleteEventRoute = ({
    express,
    MemberModel,
    GroupModel
}) => {
    const router = express.Router()

    router.delete("/" , async (req , res) => {
        const { groupId , eventName } = req.body

        try {
            const thisGroup = await GroupModel.findOne({
                _id: groupId
            })

            const thisEvent = thisGroup.events.find((event) => event.title === eventName)

            if (thisEvent.members.length > 0) {
                const eventMemberNames = thisEvent.members.map((member) => member.username)   
                const eventMembers = await MemberModel.find({
                    username: {
                        $in: eventMemberNames
                    }
                })
                eventMembers.forEach((member) => {
                    member.events = member.events.filter((event) => event.eventName !== eventName)
                    console.log(member.events)
                })

                await MemberModel.bulkSave(eventMembers)
            }
                
            thisGroup.events = thisGroup.events.filter((event) => event.title !== eventName)
            
            await thisGroup.save()

            res.status(200).json("Deleted")
        }
        catch(err){
            res.status(400).json("Server error. Event delete failed.")
        }
    })

    return router
}

module.exports = deleteEventRoute