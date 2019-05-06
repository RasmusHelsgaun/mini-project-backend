const User = require("../models/User")


async function addUser(user) {
    let newUser = new User(user)
    return await newUser.save()
    // return await User.create(user)
}

async function addJobToUser(userId, job) {
    return await User.findOneAndUpdate(
        { _id: userId },
        { $push: { job } },
        { new: true })
}

async function getAllUsers() {
    return await User.find({})
}

async function findByUsername(username) {
    return await User.findOne(
        { username }
    )
}

module.exports = {
    addUser,
    addJobToUser,
    getAllUsers,
    findByUsername
}