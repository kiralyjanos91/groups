const createEventRoute = ({
    express,
    GroupModel
}) => {
    const router = express.Router()

    router.post("/" , async (req , res) => {
        const {
            groupId,
            title,
            description,
            date,
            photo,
            location
        } = req.body.formData

        const eventData = {
            title,
            description,
            date,
            photo,
            location,
            members: []
        }

        try {

            const thisGroup = await GroupModel.findOne({
                _id: groupId
            })
            
            if (thisGroup.events.find((event) => event.title === title))
                {
                    return res.status(406).json("Event name is taken")
                }
            thisGroup.events.push(eventData)
            
            await thisGroup.save()
            
            res.status(200).json("The new group was created successfully!")
        }
        catch(err) {
            res.status(400).json(err)
        }
    })

    return router
}

module.exports = createEventRoute