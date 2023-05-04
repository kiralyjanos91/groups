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

        
        let sender = await MemberModel.findOne({username:sender_username})
        let receiver = await MemberModel.findOne({username:receiver_username})

        console.log(sender)

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
        
        // await MemberModel.findOneAndUpdate({_id: sender._id } , {$set: {
        //     private_messages: sender.private_messages
        // }})

        await MemberModel.findOneAndUpdate({_id: sender._id } , {$set: {
            private_messages: sender.private_messages
        }})
        await MemberModel.findOneAndUpdate({_id: receiver._id } , {$set: {
            private_messages: receiver.private_messages
        }})
        // await sender.update("private_messages")
        // await receiver.update("private_messages")

        // console.log(messagesHistory)
        res.status(200).json(req.body)
    })

    return router
}

module.exports = updatePrivateMessageRoute