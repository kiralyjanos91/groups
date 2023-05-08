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
        const receiverHistory = receiver.private_messages.find((message) => message.partner === sender_username)
        if (messagesHistory) {
            messagesHistory.messages.push({
                sent: true,
                date: date,
                message: current_message
            })
            receiverHistory.messages.push({
                sent: false,
                date: date,
                message: current_message
            })
            receiverHistory.unseen += 1

            sender.markModified("private_messages")
            receiver.markModified("private_messages")
        }
        else {
            sender.private_messages.push({
                partner: receiver_username,
                partner_photo: receiver_small_photo,
                unseen:0,
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
                unseen: 1,
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

        console.log(sender_username)
        console.log(receiver_username)

        // await MemberModel.updateOne({username: receiver_username , "private_messages.partner": sender_username} , {
        //     $push: {
        //         messages
        //     } 
        // })

        // MemberModel.find({})

        // MemberModel.find({ username: receiver_username, "books.type": { $nin: ["fantasy"] } })
        //     .updateOne({ $push: { "books": { "type": "fantasy" } } });

    //     try {
    //         await MemberModel.findOneAndUpdate({username: sender_username} , (error , result) => {
    //             const messagesHistory = result.private_messages.find((message) => message.partner === receiver_username)
            
    //             if (messagesHistory) {
    //                 messagesHistory.messages.push({
    //                     sent: true,
    //                     date: date,
    //                     message: current_message
    //                 })
        
    //                 result.markModified("private_messages")
    //             }
    //             else {
    //                 result.private_messages.push({
    //                     partner: receiver_username,
    //                     partner_photo: receiver_small_photo,
    //                     messages: [
    //                         {
    //                             sent: true,
    //                             date: date,
    //                             message: current_message
    //                         }
    //                     ]
    //                 })
    //             }
    //             result.update()
    //         })
    //     }
    //     catch(err) {
    //         console.log(err)
    //     }

    //     try {
    //         await MemberModel.update({username: receiver_username , "private_messages.partner": sender_username} ,  (error , result) => {
    //             const messagesHistory = result.private_messages.find((message) => message.partner === sender_username)
            
    //             if (messagesHistory) {
    //                 messagesHistory.messages.push({
    //                     sent: false,
    //                     date: date,
    //                     message: current_message
    //                 })
        
    //                 result.markModified("private_messages")
    //             }
    //             else {
    //                 result.private_messages.push({
    //                     partner: sender_username,
    //                     partner_photo: sender_small_photo,
    //                     messages: [
    //                         {
    //                             sent: false,
    //                             date: date,
    //                             message: current_message
    //                         }
    //                     ]
    //                 })
    //             }
    //             result.update()
    //         })
    //     }
    // catch(err) {
    //     console.log(err)
    // }


        // await MemberModel.findOneAndUpdate({username: receiver_username,
        //     private_messages: {
        //         $elemMatch: {
        //             partner: sender_username,
        //             partner_photo: sender_small_photo
        //         }
        //     } } , {$push: {
        //         "private_messages[0].messages": {
        //                 sent: false,
        //                 date: date,
        //                 message: current_message
        //             }
        //     }, upsert: true})
         

        // console.log(messagesHistory)
        res.status(200).json(req.body)
    })

    return router
}

module.exports = updatePrivateMessageRoute