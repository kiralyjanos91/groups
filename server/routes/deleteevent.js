const deleteEventRoute = ({
    express,
    MemberModel,
    GroupModel
}) => {
    const router = express.Router()

    router.delete("/" , async (req , res) => {
        const { groupId , eventName } = req.body

        const thisGroup = await GroupModel.findOne({
            _id: groupId
        })

        const thisEvent = thisGroup.events.find((event) => event.title === eventName)

        // if (thisEvent.members.lenght > 0) {

            
            // const eventMembers = await MemberModel.find({
            //     name: {
            //             $in: [thisEvent.members]
            //         }
            // })

            // eventMembers.forEach((member) => {

            // })

        // }


        thisGroup.events = thisGroup.events.filter((event) => event.title !== eventName)

        console.log(eventName)

        console.log(thisGroup.events)

    })

    return router
}

module.exports = deleteEventRoute