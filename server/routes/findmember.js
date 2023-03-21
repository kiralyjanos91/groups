const findMemberRoute = ({
    express,
    MemberModel
}) => {
    const router = express.Router()

    router.get("/" , (req , res) => {

        const { memberletters } = req.params

        console.log(req.params)

        res.status(200).json("ok")
    })

    return router
}

module.exports = findMemberRoute