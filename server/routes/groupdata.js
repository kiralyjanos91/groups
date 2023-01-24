const groupDataRoute = ({
    express,
    GroupModel
}) => {
    const router = express.Router()
    router.post("/" , async (req , res) => {
        const { id } = req.body
        try {
            const groupInfo = await GroupModel.findOne({ _id: id })
            res.status(200).json(groupInfo)
        }
        catch {
            res.status(403).json("Not found group info")
        }
    })
    return router
}

module.exports = groupDataRoute