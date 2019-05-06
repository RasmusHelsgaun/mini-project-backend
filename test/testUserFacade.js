const expect = require('chai').expect;
const userFacade = require('../facades/userFacade')
const User = require('../models/User')

var connect = require("../dbConnect.js");
connect(require("../settings").TEST_DB_URI);

describe("User facade", function () {
    var addedUser

    after(async function () {
        await User.deleteMany({})
    })

    describe("Testing add user to the DB", function () {
        it("Should add and return the new user", async function () {
            let user = {
                firstName: "Kurt", lastName: "Wonnegut", username: "kurt", password: "test", email: "kurt@wonnegut.dk",
            }
            addedUser = await userFacade.addUser(user)
            expect(addedUser.firstName).to.be.equal("Kurt")
        })
    })

    describe("Testing add job to existing user", function () {
        it("Should add the job and return the edited user", async function () {
            let job = { type: "a", company: "ab", companyUrl: "ab.dk" }
            const result = await userFacade.addJobToUser(addedUser._id, job)
            expect(result.job.length).to.be.equal(1)
        })
    })

    describe("Testing find all users", function () {
        it("Should return all existing users", async function () {
            const result = await userFacade.getAllUsers()
            expect(result.length).to.be.equal(1)
        })
    })

    describe("Testing find user by username", function () {
        it("Should return the user with the given username", async function () {
            const result = await userFacade.findByUsername("kurt")
            expect(result.username).to.be.equal("kurt")
        })
    })
})