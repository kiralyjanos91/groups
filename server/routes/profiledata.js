const profileDataRoute = ({
    express,
    MemberModel
}) => {
    const router = express.Router()
    router.get("/" , async (req , res) => {
        const username = req.cookies["localhost300user"]
        const member = await MemberModel.findOne({ username })
        res.status(200).json(member)
    })
    return router
}

module.exports = profileDataRoute