const registrationRouter = ({ 
    MemberModel,
    express,
    jwt,
    RefreshTokenModel 
}) => {
    const router = express.Router()
    router.post("/" , async (req , res) => {
        const { username , password } = req.body 
        const member = new MemberModel({
        username,
        password
    })
    try {
        const usernameTaken = await MemberModel.findOne({ username })
        if ( usernameTaken ) {
            return res.status(409).json("Username is taken")
        }
        const response = await member.save()
        const newToken = jwt.sign({ username } , process.env.ACCESS_TOKEN_SECRET , { expiresIn: "10s" })
        const refreshToken = jwt.sign({ username } , process.env.REFRESH_TOKEN_SECRET)
        const newRefreshToMongo = new RefreshTokenModel({
            token: refreshToken,
            username: username
        })
        const rftSaveResponse = await newRefreshToMongo.save((err,user)=>{
            if(err){
                return res.status(405).json("Failed to save new user")
            }
        })

        const user = { username }

        res.cookie("token" , refreshToken , {
            httpOnly:true
        })
        res.cookie("localhost300user" , username , {
            httpOnly:true
        })
        res.status(200).json({ newToken , user })
    }
    catch(e) {
        return res.status(403).json(`Error: ${e}`)
    } 
    })
    return router
}
module.exports = registrationRouter