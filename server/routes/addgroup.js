const addGroupsRoute = ({
    express,
    GroupModel
}) => {
    const router = express.Router()
    router.post("/" , async (req , res) => {
        const { name } = req.body
        const newGroup = new GroupModel({
            name
        })
        try {
            response = await newGroup.save()
            res.status(200).json(`group added successfully. ${response}`)
        }
        catch(e) {
            res.status(400).json("Failed to add new group")
        }
    })
    return router
}

module.exports = addGroupsRoute