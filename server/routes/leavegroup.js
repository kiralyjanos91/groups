const leaveGroupRoute = ({
    express,
    MemberModel,
    GroupModel
}) => {
    const router = express.Router()

    router.post("/" , async (req , res , next) => {

        const { groupName , id , user } = req.body

        try {
            await GroupModel.updateOne({
                name: groupName
            } , {
                $pull: {
                    members: {
                        username: user.username 
                    }
                }
            })
            
            await MemberModel.updateOne({
                username: user.username
            } , {
                $pull: {
                    groups: {
                        name: groupName
                    }
                }
            })
            return res.status(200).json("Leaved")
        }
        catch(err) {
            res.status(400).json(err)
        }

        next()
    })

    return router
}

module.exports = leaveGroupRoute