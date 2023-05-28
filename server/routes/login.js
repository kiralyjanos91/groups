const loginRoute = ({
    MemberModel,
    express,
    jwt,
    RefreshTokenModel 
}) => {
    const router = express.Router()
    router.post("/" , async (req , res) => {
    const { username , password } = req.body
    
        const userData = await MemberModel.findOne({ username }) 
        if (!userData) {
            return res.status(401).json("Invalid username")
        }
        if (userData.password !== password) {
            return res.status(401).json("Wrong password")
        }
        
        const newToken = jwt.sign({ username } , process.env.ACCESS_TOKEN_SECRET , { expiresIn: "10s" })
        const refreshToken = jwt.sign({ username } , process.env.REFRESH_TOKEN_SECRET)
        const newRefreshToMongo = new RefreshTokenModel({
            token: refreshToken,
            username: username
        })

    try {
        const rftSaveResponse = await newRefreshToMongo.save()
    } 
    catch(e){
        return res.status(500)(`Database error. We work on it. Please try again later`)
    }
    
    res.cookie("token" , refreshToken , {
        httpOnly: true, 
        sameSite: 'none', 
        secure: true
    })
    res.cookie("groupyxuser" , username , {
        httpOnly: true, 
        sameSite: 'none', 
        secure: true
    })

    const user = {
        username,
        own_groups: userData?.own_groups,
        groups: userData?.groups,
        events: userData?.events,
        small_photo: userData?.photos?.small_photo || ""
    }

    res.status(200).json({ newToken , user })
})

return router
}

module.exports = loginRoute