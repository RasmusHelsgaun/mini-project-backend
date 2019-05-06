const express = require("express")
const router = express.Router()

const userRouter = require("./api/userApi")
const blogRouter = require("./api/blogApi")
const loginRouter = require("./api/loginApi")

router.use("/users", userRouter)
router.use("/blogs", blogRouter)
router.use("/login", loginRouter)

module.exports = router