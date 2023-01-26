const verifyTokenRoute = ({
    express,
    jwt,
    RefreshTokenModel,
    MemberModel
}) => {
    const router = express.Router()
    router.use("/" , async (req , res , next) => {
        const { accessToken } = req.body
        const refreshToken = req.cookies["token"]
        const username = req.cookies["localhost300user"]
        const newToken = jwt.sign({ username } , process.env.ACCESS_TOKEN_SECRET , { expiresIn: "10s" })
        const refreshTokenInMongo = await RefreshTokenModel.findOne({token: refreshToken})
        const userData = await MemberModel.findOne({ username })
        const { own_groups , groups } = userData

        const user = {
            username,
            own_groups,
            groups
        }

        jwt.verify(accessToken , process.env.ACCESS_TOKEN_SECRET, (err , decoded) => {
            if (err) {
                if (!refreshToken || !refreshTokenInMongo || !username) {
                    return res.status(401).json("Authorization is failed")
                }
                jwt.verify(refreshToken , process.env.REFRESH_TOKEN_SECRET , (err , decoded) => {
                    if (err) {
                        return res.status(401).json("Invalid or missing refresh token")
                    }
                })
                return res.status(200).json({ newToken , user })
            }
            else {
                return res.status(202).json("Valid Token")
            }
        })
        next()
    })

    return router
}

module.exports = verifyTokenRoute