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
            hobby,
            about
        } = req.body.formData || {}

        const {
            country,
            countryCode,
            state,
            stateCode,
            city
        } = req.body.locationSelector

        const location = {
            country,
            state,
            city,
            stateCode,
            countryCode
        }

        console.log(location)

        try {
            await MemberModel.updateOne({
                username
            }, {
                    gender,
                    birth,
                    location,
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