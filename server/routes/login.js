const loginRoute = ({
    MemberModel,
    express,
    jwt,
    RefreshTokenModel 
}) => {
    const router = express.Router()
    router.post("/" , async (req , res) => {
    const { username , password } = req.body
    
    const user = await MemberModel.findOne({ username }) 
    if(!user) {
        return res.status(401).json("Invalid username")
    }
    if(user.password !== password) {
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
        httpOnly:true
    })
    res.cookie("localhost300user" , username , {
        httpOnly:true
    })
    res.status(200).json({ newToken , user })
})

return router
}

module.exports = loginRoute