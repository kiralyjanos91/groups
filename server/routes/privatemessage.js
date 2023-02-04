const privateMessageRoute = ({
    express,
    MemberModel
}) => {

    const router = express.Router()

    router.post("/" , async (req , res) => {

        const { ownName , partnerName , message } = req.body

        await MemberModel.bulkWrite(
            [
                {
                    updateOne: {
                            "filter": {
                                name: ownName
                            },
                            "update": {
                                "$push": {
                                    "private_messages": { message }
                                }
                            }
                    },
                    updateOne: {
                        "filter": {
                            name: partnerName
                        },
                        "update": {
                            "$push": {
                                "private_messages": { message }
                            }
                        }
                    }
                }
            ]
        )
    })

    return router
}

module.exports = privateMessageRoute