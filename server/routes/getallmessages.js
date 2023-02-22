const getAllMessagesRoute = ({
    express,
    MemberModel
}) => {
    const router = express.Router()

    router.post("/" , async (req , res) => {
        try {
            const { username } = req.body
            const user = await MemberModel.findOne({
                "username": username
            })
 
            res.status(200).json(user.private_messages)
        }
        catch(err){
            res.status(404).json(err)
        }
    })

    return router
}

module.exports = getAllMessagesRoute