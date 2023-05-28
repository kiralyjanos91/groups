const logoutRoute = ({
    RefreshTokenModel,
    express
}) => {
    const router = express.Router()

    router.post("/" , async (req , res) =>{
        const username = req.cookies["groupyxuser"]
        try {
            await RefreshTokenModel.deleteMany({username:username})
        }
        catch(e) {
            res.status(400).json(`Failed to logout. Error: ${e}`)
        }
        res.status(200).json("Logged Out")
    })

    return router
}

module.exports = logoutRoute