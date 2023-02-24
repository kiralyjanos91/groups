const findPrivateMessageRoute = ({ 
    express,
    MemberModel
}) => {

    const router = express.Router()

    router.post("/" , async (req , res) => {
        const { username , partner_name } = req.body
        const user = await MemberModel.findOne({ "username": username })
        const messagesWithThisPartner = user.private_messages?.find((message) => message.partner === partner_name )
        
        if( !messagesWithThisPartner ) {
            return res.status(204).json("No messages yet")
        }
        res.status(200).json(messagesWithThisPartner)
    })

    return router
}

module.exports = findPrivateMessageRoute