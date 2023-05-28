const profileDataRoute = ({
    express,
    MemberModel
}) => {
    const router = express.Router()
    router.get("/" , async (req , res) => {
        const username = req.cookies["groupyxuser"]
        const member = await MemberModel.findOne({ username })
        res.status(200).json(member)
    })
    
    return router
}

module.exports = profileDataRoute