const express = require("express")
const router = express.Router()
const facade = require("../../facades/userFacade")

router.get("/", async function (req, res, next) {
    try {
        res.send(await facade.getAllUsers())
    } catch (err) {
        res.json({ status: 500, msg: "Something went wrong trying to get all users" })
    }
})

router.post("/", async function (req, res, next) {
    try {
        let user = { firstName, lastName, username, password, email } = req.body
        res.send(await facade.addUser(user))
    } catch (err) {
        res.json({ status: 500, msg: "Something went wrong trying to add the user" })
    }
})

router.get("/:username", async function (req, res, next) {
    try {
        var username = req.params.username
        var user = await facade.findByUsername(username)
        if (user) {
            res.send(user)
        } else {
            throw Error()
        }
    } catch (err) {
        res.json({ status: 500, msg: "Something went wrong trying to find the user" })
    }
})


router.put("/job/:username", async function (req, res, next) {
    try {
        let username = req.params.username
        let userId = { _id } = await facade.findByUsername(username)
        let user = await facade.addJobToUser(userId, req.body)
        res.send(user)
    } catch (err) {
        res.json({ status: 500, msg: "Something went wrong trying to add the job" })
    }
})

module.exports = router