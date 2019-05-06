const express = require("express")
const router = express.Router()
const userFacade = require("../../facades/userFacade")
const facade = require("../../facades/blogFacade")

router.post("/", async function (req, res, next) {
    try {
        let blog = { info, pos, author } = req.body
        res.send(await facade.addLocationBlog(blog))
    } catch (err) {
        res.json({ status: 500, msg: "Something went wrong adding the locationblog" })
    }
})

router.put("/", async function (req, res, next) {
    try {
        let { blogId, username } = req.body
        let user = await userFacade.findByUsername(username)
        res.send(await facade.likeLocationBlog(blogId, user))
    } catch (err) {
        res.json({ status: 500, msg: "Something went wrong trying to like the locationblog" })
    }
})

module.exports = router