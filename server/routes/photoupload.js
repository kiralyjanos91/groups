const multer = require("multer")
const multerS3 = require("multer-s3")
const { S3Client } = require("@aws-sdk/client-s3")
const path = require("path")

const pohotoUploadRoute = ({
    express
}) => {

const router = express.Router()

const s3 = new S3Client({
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    },
    region: "us-east-1"
})

const s3Storage = multerS3({
    s3: s3,
    bucket: "groupsiteimages",
    acl: "public-read",
    metadata: (req, file, cb) => {
        cb(null, {fieldname: file.fieldname})
    },
    key: (req, file, cb) => {
        const fileName = "profile_photos/" + Date.now() + "_" + file.fieldname + "_" + file.originalname;
        cb(null,fileName)
    } 
})

function filterFile(file, cb) {

    const fileExts = [ ".jpg", ".jpeg", ".png" ];
    const isAllowedExt = fileExts.includes(
        path.extname(file.originalname.toLowerCase())
    )

    const isAllowedMimeType = file.mimetype.startsWith("image/");

    if (isAllowedExt && isAllowedMimeType) {
        return cb(null, true);
    } else {
        cb("File not allowed");
    }
}

const uploadImage = multer({
    storage: s3Storage,
    fileFilter: (req, file, callback) => {
        filterFile(file, callback)
    },
    limits: {
        fileSize: 1024 * 1024 * 2 // 2mb file size
    }
})


router.put("/", 
uploadImage.single("image"), 
(req, res, next) => {
        /* 
           req.file = { 
             fieldname, originalname, 
             mimetype, size, bucket, key, location
           }
        */

        // location key in req.file holds the s3 url for the image



        // let data = {}
        // if(req.file) {
        //     data.image = req.file.location
        // }

        // console.log(data.image)

           console.log(req.body.username)

           res.status(200).json(req.file.location)

        // HERE IS YOUR LOGIC TO UPDATE THE DATA IN DATABASE
    }
)

return router
}

module.exports = pohotoUploadRoute