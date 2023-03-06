const createEventRoute = ({
    express,
    GroupModel
}) => {
    const router = express.Router()

    router.post("/" , async (req , res) => {
        const {
            groupId,
            eventName,
            eventDate,
            location,
            details
        } = req.body

        await GroupModel.findOne({
            id: groupId
        })
        res.status(200).json("ok")
    })

    return router
}

module.exports = createEventRoute