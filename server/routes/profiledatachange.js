const profileDataChangeRoute = ({
    express,
    MemberModel
}) => {
    const router = express.Router()

    router.post("/" , async (req , res) => {

        const {
            username,
            gender,
            birth,
            city,
            hobby,
            about
        } = req.body || {}

console.log(req.body)

        try {
            await MemberModel.updateOne({
                username
            }, {
                    gender,
                    birth,
                    city,
                    hobby,
                    about
                }
            )
            
            res.status(200).json("Saved")
        }
        catch(err) {
            res.status(400).json(err)
        }
    })

    return router
}

module.exports = profileDataChangeRoute