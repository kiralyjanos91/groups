const membermodel = require("../mongoose_models/membermodel")

const joinGroupRoute = ({
    express,
    GroupModel,
    MemberModel
}) => {
    const router = express.Router()

    router.post("/" , async (req , res , next) => {

        const { groupName , user } = req.body

        try {
            const saveToGroupReponse = await GroupModel.updateOne({
                name: groupName
            } , {
                $push: {
                    members: user
                }
            })
            
            const saveToUserResponse = await MemberModel.updateOne({
                username: user.username
            } , {
                $push: {
                    groups: groupName
                }
            })
            return res.status(200).json("Joined")
        }
        catch(err) {
            res.status(400).json(err)
        }
        next()
        })
        return router
    }

module.exports = joinGroupRoute