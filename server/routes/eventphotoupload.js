const multer = require("multer")
const multerS3 = require("multer-s3")
const { S3Client } = require("@aws-sdk/client-s3")
const path = require("path")

const eventPhotoUploadRoute = ({
    express,
    GroupModel
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
            const fileName = "event_photos/" + Date.now() + "_" + "event_photo" + "_" + file.originalname;
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
            fileSize: 1024 * 1024 * 5
        }
    })


    router.put("/", uploadImage.single("image"), async (req, res, next) => {
            // await GroupModel.updateOne({"name": groupName},
            //     {     
            //         $set: {
            //             "photo": req.file.location
            //         } 
            //     }
            // )
            // const file = await req.file
            // const filelocation = await req.file.location

            // console.log(req.file.location)

            res.status(200).json(req.file.location)
            // console.log(req.file.location)
        }
    )

    return router
}

module.exports = eventPhotoUploadRoute