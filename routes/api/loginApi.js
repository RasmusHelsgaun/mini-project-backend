const express = require("express")
const router = express.Router()
const facade = require('../../facades/loginFacade');

router.post("/", async function (req, res, next) {
    const { username, password, latitude, longitude, distance } = req.body
    const response = await facade.login(username, password, longitude, latitude, distance)

    if (response.msg) {
        return res.status(response.status).json(response)
    }

    return res.json(response)
})

module.exports = router