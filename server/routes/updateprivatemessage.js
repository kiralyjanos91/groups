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

        await MemberModel.findOne({username:sender_username , "private_messages.partner": receiver_username})
            .exec( async function (err , user) {
                if (err) 
                    {
                        console.log(err)
                    }
                if (user) {
                    await MemberModel.update (
                        {username:sender_username , "private_messages.partner": receiver_username},
                        {
                            $push: {
                                "private_messages.$.messages": 
                                {
                                    sent: true,
                                    date: date,
                                    message: current_message
                                }
                            }
                        }   
                    )
                    await MemberModel.update (
                        {username:receiver_username , "private_messages.partner": sender_username},
                        {
                            $push: {
                                "private_messages.$.messages": 
                                {
                                    sent: false,
                                    date: date,
                                    message: current_message
                                }
                            },
                            $inc: {
                                "private_messages.$.unseen" : 1
                            }
                        }   
                    )
                }
                else {
                    await MemberModel.update (
                        {username:sender_username},
                        {
                            $push: {
                                "private_messages": 
                                {
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
                                }
                            }
                        }    
                    )
                    await MemberModel.update (
                        {username:receiver_username},
                        {
                            $push: {
                                "private_messages": 
                                {
                                    partner: sender_username,
                                    partner_photo: sender_small_photo,
                                    unseen:1,
                                    messages: [
                                        {
                                            sent: false,
                                            date: date,
                                            message: current_message
                                        }
                                    ]
                                }
                            }
                        }    
                    )
                }
            })
        res.status(200).json(req.body)
    })

    return router
}

module.exports = updatePrivateMessageRoute