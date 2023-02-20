const updatePrivateMessageRoute = ({
    express,
    MemberModel
}) => {

    const router = express.Router()

    router.post("/" , async (req , res) => {

        const { 
            sender_username,
            sender_small_photo,
            receiver_username,
            receiver_small_photo,
            message
        } = req.body

        res.status(200).json("test")
    })

    return router
}

module.exports = updatePrivateMessageRoute