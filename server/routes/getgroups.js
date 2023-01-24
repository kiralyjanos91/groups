const getGroupsRoute = ({
    express,
    GroupModel
}) => {
    const router = express.Router()
    router.get("/" , async (req , res) => {
        try{
            const groups = await GroupModel.find()
            res.status(200).json(groups)
        }
        catch(e){
            res.status(400).json(e)
        }
    })
    return router
}

module.exports = getGroupsRoute