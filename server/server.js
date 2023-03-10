const express = require("express")
const app = express()
const cors = require("cors")
const mongoose = require("mongoose")
const cookieParser = require("cookie-parser")
const jwt = require("jsonwebtoken")
require('dotenv').config()

const registrationRoute = require("./routes/registration")
const loginRoute = require("./routes/login")
const logoutRoute = require("./routes/logout")
const verifyRoute = require("./routes/verifytoken")
const addGroupRoute = require("./routes/addgroup")
const getGroupsRoute = require("./routes/getgroups")
const profileDataRoute = require("./routes/profiledata")
const groupDataRoute = require("./routes/groupdata")
const joinGroupRoute = require("./routes/joingroup")
const memberDataRoute = require("./routes/memberdata")
const userDataUpdateRoute = require("./routes/userdataupdate")
const leaveGroupRoute = require("./routes/leavegroup")
const profileDataChangeRoute = require("./routes/profiledatachange")
const sendToChatRoute = require("./routes/sendtochat")
const updatePrivateMessageRoute = require("./routes/updateprivatemessage")
const findPrivateMessageRoute = require("./routes/findprivatemessage")
const profilePohotoUploadRoute = require("./routes/profilephotoupload")
const groupPhotoUploadRoute = require("./routes/groupphotoupload")
const getAllMessagesRoute = require("./routes/getallmessages")
const createEventRoute = require("./routes/createevent")
const eventPhotoUploadRoute = require("./routes/eventphotoupload")
const joinToEvent = require("./routes/jointoevent")

const CONNECTION_STRING = process.env.CONNECTION_STRING
const mongoOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}
const connectionCallback = () => { console.log("MongoDb Connected")}
mongoose.connect( CONNECTION_STRING , mongoOptions, connectionCallback )

app.use( express.urlencoded({ extended : true }) )
app.use( express.json() )
app.use( cors() )
app.use( cookieParser() )

const PORT = process.env.PORT
const serverCallback = () => console.log(`Server started at Port ${PORT}`)

const MemberModel = require("./mongoose_models/membermodel")
const RefreshTokenModel = require("./mongoose_models/refreshtokenmodel")
const GroupModel = require("./mongoose_models/groupmodel")

app.post("/auth" , verifyRoute({
    express,
    jwt,
    RefreshTokenModel,
    MemberModel
})) 

app.use("/sendregistration" , registrationRoute({
    MemberModel,
    RefreshTokenModel,
    express,
    jwt
}))

app.use("/sendlogin" , loginRoute({
    MemberModel,
    RefreshTokenModel,
    express,
    jwt
}))

app.use("/sendlogout" , logoutRoute({
    RefreshTokenModel,
    express
}))

app.use("/getgroups" , getGroupsRoute({
    express,
    GroupModel
}))

app.use("/addgroup" , addGroupRoute({
    express,
    GroupModel,
    MemberModel
}))

app.use("/groupdata" , groupDataRoute({
    express,
    GroupModel
}))

app.use("/profiledata" , profileDataRoute({
    express,
    MemberModel
}))

app.use("/profiledatachange" , profileDataChangeRoute({
    express,
    MemberModel
}))

app.use("/joingroup" , joinGroupRoute({
    express,
    GroupModel,
    MemberModel
}))

app.use("/leavegroup" , leaveGroupRoute({
    express,
    GroupModel,
    MemberModel
}))

app.use("/memberdata" , memberDataRoute({
    express,
    MemberModel
}))

app.use("/userdataupdate" , userDataUpdateRoute({
    express,
    MemberModel
}))

app.use("/sendtochat" , sendToChatRoute({
    express,
    GroupModel
}))

app.use("/photoupload" , profilePohotoUploadRoute({
    express,
    MemberModel,
    GroupModel
}))

app.use("/groupphotoupload" , groupPhotoUploadRoute({
    express,
    GroupModel
}))

app.use("/sendprivatemessage" , updatePrivateMessageRoute({
    express,
    MemberModel
}))

app.use("/findprivatemessage" , findPrivateMessageRoute({
    express,
    MemberModel
}))

app.use("/getallmessages" , getAllMessagesRoute({
    express,
    MemberModel
}))

app.use("/createevent" , createEventRoute({
    express,
    GroupModel
}))

app.use("/eventphotoupload" , eventPhotoUploadRoute({
    express,
    GroupModel
}))

app.use("/jointoevent" , joinToEvent({
    express,
    GroupModel,
    MemberModel
}))

app.listen(PORT , serverCallback) 

