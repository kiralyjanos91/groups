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
            current_message,
            date
        } = req.body

        
        const sender = await MemberModel.findOne({username:sender_username})
        const receiver = await MemberModel.findOne({username:receiver_username})

        const messagesHistory = sender.private_messages.find((message) => message.partner === receiver_username)
        if (messagesHistory) {
            messagesHistory.messages.push({
                sent: true,
                date: date,
                message: current_message
            })
            receiver.private_messages.find((message) => message.partner === sender_username).messages.push({
                sent: false,
                date: date,
                message: current_message
            })

            sender.markModified("private_messages")
            receiver.markModified("private_messages")
        }
        else {
            sender.private_messages.push({
                partner: receiver_username,
                partner_photo: receiver_small_photo,
                messages: [
                    {
                        sent: true,
                        date: date,
                        message: current_message
                    }
                ]
            })
            receiver.private_messages.push({
                partner: sender_username,
                partner_photo: sender_small_photo,
                messages: [
                    {
                        sent: false,
                        date: date,
                        message: current_message
                    }
                ]
            })
        }

        await sender.save()
        await receiver.save()

        // console.log(messagesHistory)
        res.status(200).json(req.body)
    })

    return router
}

module.exports = updatePrivateMessageRoute