const sendToChatRoute = ({
    express,
    GroupModel
}) => {
    const router = express.Router()

    router.post("/" , async (req , res, next) => {
        const { username , message , groupName , date } = req.body || {}

        console.log(username , message , groupName , date)

        try {
            await GroupModel.updateOne({
                name: groupName
                }, {
                $push: {
                    messages: {
                        username,
                        message,
                        date
                    }
                }
            }
            )
            res.status(200).json("Message sent")
        }
        catch(err) {
            res.status(400).json(err)
        }
        next()
    })

    return router
}

module.exports = sendToChatRoute