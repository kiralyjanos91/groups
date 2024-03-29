const express = require("express")
const app = express()
const cors = require("cors")
const mongoose = require("mongoose")
const cookieParser = require("cookie-parser")
const jwt = require("jsonwebtoken")
require('dotenv').config()
const socketio = require("socket.io")
const server = require('http').Server(app)
const io = socketio(server, { cors: {
    origin: "*",
    methods: ["PUT", "GET", "POST", "DELETE", "OPTIONS"],
    credentials: true
  }
})

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
const messagesSeenRoute = require("./routes/messagesseen")
const findPrivateMessageRoute = require("./routes/findprivatemessage")
const profilePohotoUploadRoute = require("./routes/profilephotoupload")
const groupPhotoUploadRoute = require("./routes/groupphotoupload")
const getAllMessagesRoute = require("./routes/getallmessages")
const createEventRoute = require("./routes/createevent")
const eventPhotoUploadRoute = require("./routes/eventphotoupload")
const joinToEvent = require("./routes/jointoevent")
const leaveEvent = require("./routes/leaveevent")
const banMemberRoute = require("./routes/banmember")
const deleteEventRoute = require("./routes/deleteevent")
const findMemberRoute = require("./routes/findmember")
const popularGroupsRoute = require("./routes/populargroups")

const CONNECTION_STRING = process.env.CONNECTION_STRING
const mongoOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}
const connectionCallback = () => { console.log("MongoDb Connected")}
mongoose.connect( CONNECTION_STRING , mongoOptions, connectionCallback )

app.use( express.urlencoded({ extended : true }) )
app.use( express.json() )
app.use( cors({
    // origin: 'https://groupyx.netlify.app/',
    origin: "http://localhost:3000",
    credentials: true
}) )
app.use( cookieParser() )

const PORT = process.env.PORT || 8080
const serverCallback = () => console.log(`Server started at Port ${PORT}`)

const MemberModel = require("./mongoose_models/membermodel")
const RefreshTokenModel = require("./mongoose_models/refreshtokenmodel")
const GroupModel = require("./mongoose_models/groupmodel")

let loggedInUsers = []
io.on("connection", (socket) => {
    socket.on("userLogin" , (username) => {
        loggedInUsers.push({
            username,
            socketId: socket.id,
            viewedMember: ""
        })
    })

    socket.on("joinToRoom" , (roomId) => {
        socket.join(roomId)
    })
    
    socket.on("leaveRoom" , (roomId) => {
        socket.leave(roomId)
    })

    socket.on("groupMessage" , (groupMessage) => {
        const groupId = groupMessage.groupId
        io.sockets.in(groupId).emit("groupMessage" , groupMessage)
    })

    socket.on("viewMember" , (member) => {
        const thisMember = loggedInUsers.find((user) => user.socketId === socket.id)
        if (thisMember) {
            thisMember.viewedMember = member
        }
    })

    socket.on("notViewMembers" , () => {
        const thisMember = loggedInUsers.find((user) => user.socketId === socket.id)
        if (thisMember) {
            thisMember.viewedMember = ""
        }
    })
  
    socket.on("sendMessage", (message) => {
        const senderId = socket.id
        const senderName = message.sender_username
        const partnerName = message.receiver_username
        const partnerTabs = loggedInUsers.filter((user) => user.username === partnerName)
        const senderTabs = loggedInUsers.filter((user) => user.username === senderName)
        const partnerTabsList = []
        if (partnerTabs.length > 0) {
            partnerTabs.map((tab) => {
                partnerTabsList.push(tab.socketId)
            })
        }
        const senderTabsList = []
        if (senderTabs.length > 0) {
            senderTabs.map((tab) => {
                senderTabsList.push(tab.socketId)
            })
        }
        const viewsPartnerList = []
        const viewsPartnerTabs = senderTabs.filter((tab) => tab.viewedMember === partnerName)
        if (viewsPartnerTabs.length > 0) {
            viewsPartnerTabs.map((tab) => {
                viewsPartnerList.push(tab.socketId)
            })
        }
        const viewsSenderTabs = partnerTabs.filter((tab) => tab.viewedMember === senderName)
        const viewsSenderList = []
        if (viewsSenderTabs.length > 0) {
            viewsSenderTabs.map((tab) => {
                viewsSenderList.push(tab.socketId)
            })
        }

        if (partnerTabs.length > 0) {
            io.sockets.to(partnerTabsList).emit("message", message)
            io.sockets.to(senderTabsList).emit("message", message) 
            if (viewsPartnerList.length > 0) {
                io.sockets.to(viewsPartnerList).emit("memberMessage", message)
            }
            if (viewsSenderTabs.length > 0) {
                io.sockets.to(viewsSenderList).emit("memberMessage", message)
            }
        }
        else {
            io.sockets.to(senderTabsList).emit("message", message)
            if (viewsPartnerList.length > 0) {
                io.sockets.to(viewsPartnerList).emit("memberMessage", message)
            }
        }
    })

    socket.on("sendGroupMessage" , (groupMessage) => {
        io.emit("groupMessage" , groupMessage)
    })
  
    socket.on("disconnect", () => {
        loggedInUsers = [...loggedInUsers.filter((user) => user.socketId !== socket.id)]
    })
})

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

app.use("/banmember" , banMemberRoute({
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

app.use("/messageseen" , messagesSeenRoute({
    express,
    MemberModel
}))

app.use("/getallmessages" , getAllMessagesRoute({
    express,
    MemberModel
}))

app.use("/findmember" , findMemberRoute({
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

app.use("/leaveevent" , leaveEvent({
    express,
    GroupModel,
    MemberModel
}))

app.use("/deleteevent" , deleteEventRoute({
    express,
    GroupModel,
    MemberModel
}))

app.use("/populargroups" , popularGroupsRoute({
    express,
    GroupModel
}))

server.listen(PORT , serverCallback) 

