const messagesSeenRoute = ({
    MemberModel,
    express
}) => {
    const router = express.Router()

    router.post("/" , async (req , res) => {

        const {userName , partnerName} = req.body

        try {
            const user = await MemberModel.findOneAndUpdate({ username: userName , "private_messages.partner": partnerName} , {
                $set: { "private_messages.$.unseen": 0 }
            })
            res.status(200).json("seen")
        }
        catch(err) {
            res.status(400).json(err)
        }

        
    })

    return router
}

module.exports = messagesSeenRoute