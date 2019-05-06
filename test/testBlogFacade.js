const expect = require('chai').expect;
const blogFacade = require('../facades/blogFacade')
const userFacade = require('../facades/userFacade')
const Blog = require('../models/LocationBlog')
const User = require('../models/User')

var connect = require("../dbConnect.js");
connect(require("../settings").TEST_DB_URI);

describe("Blog facade", function () {
    var addedBlog
    var addedUser

    after(async function () {
        await Blog.deleteMany({})
        await User.deleteMany({})
    })

    before(async function () {
        let user =
            {
                firstName: "test", lastName: "test", username: "test", password: "test", email: "test@test.dk",
                job: [{ type: "b", company: "B", companyUrl: "b.dk" },
                { type: "bb", company: "BB", companyUrl: "bb.dk" }]
            }

            addedUser = await userFacade.addUser(user)
    })

    describe("Testing add LocationBlog", function () {
        it("Should add and return the new locationblog", async function () {
            let blog = { info: "Cool Place", pos: { longitude: 26, latitude: 57 }, author: addedUser._id }
            addedBlog = await blogFacade.addLocationBlog(blog)
            expect(addedBlog.author).to.be.equal(addedUser._id)
        })
    })

    describe("Testing like location", function () {
        it("Should add the user to the likedBy list, and return the location", async function () {
            addedBlog = await blogFacade.likeLocationBlog(addedBlog._id, addedUser)
            expect(addedBlog.likedBy.length).to.be.equal(1)
        })
    })
})