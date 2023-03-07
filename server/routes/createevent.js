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

        const thisGroup = await GroupModel.findOne({
            _id: groupId
        })

        thisGroup.events.push(eventData)

        await thisGroup.save()

        res.status(200).json("The new group was created successfully!")
    })

    return router
}

module.exports = createEventRoute