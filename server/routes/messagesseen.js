const messagesSeenRoute = ({
    MemberModel,
    express
}) => {
    const router = express.Router()

    router.post("/" , async (req , res) => {

        const {userName , partnerName} = req.body

        const user = await MemberModel.findOneAndUpdate({ username: userName , "private_messages.partner": partnerName} , {
            $set: { "private_messages.$.unseen": 0 }
        })
    })

    return router
}

module.exports = messagesSeenRoute