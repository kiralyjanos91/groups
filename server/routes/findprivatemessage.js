const findPrivateMessageRoute = ({ 
    express,
    MemberModel
}) => {

    const router = express.Router()

    router.post("/" , async (req , res) => {

        const { username , messages_from } = req.body

        const user = await MemberModel.findOne({ "username": username })

        console.log(user)
    })

    return router
}

module.exports = findPrivateMessageRoute