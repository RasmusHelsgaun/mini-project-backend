const expect = require('chai').expect;

const fetch = require("node-fetch")
const { makeOptions, handleHttpErrors } = require("./utils/fetchUtils")

const LocationBlog = require("../models/LocationBlog")
const User = require("../models/User")
const Position = require("../models/Position")

const PORT = 3456
const URL = `http://localhost:${PORT}`
const url_blogs = `${URL}/api/blogs/`
const url_users = `${URL}/api/users/`
const url_login = `${URL}/api/login/`

//connection to TEST_DB_URI
const connect = require("../dbConnect")
connect(require("../settings").TEST_DB_URI);

//making server
var express = require('express');
var apiRouter = require('../routes/api');
var app = express();
app.use(express.json());
app.use('/api', apiRouter);
app.listen(PORT)

describe("Testing of all API's", function () {
    var testUser1
    var testUser2
    var testBlog1

    beforeEach(async function () {
        testUser1 = new User(
            {
                firstName: "Test1",
                lastName: "Test1",
                username: "test1",
                password: "1234",
                email: "test1@test.dk",
            })
        await testUser1.save()

        testUser2 = new User(
            {
                firstName: "Test2",
                lastName: "Test2",
                username: "test2",
                password: "1234",
                email: "test2@test.dk",
            })
        await testUser2.save()

        testBlog1 = new LocationBlog({
            info: "Beautiful test blog",
            pos: { longitude: 10, latitude: 20 },
            author: testUser1._id
        })
        await testBlog1.save()
    })

    afterEach(async function () {
        await User.deleteMany({})
        await LocationBlog.deleteMany({})
        await Position.deleteMany({})
    })

    describe("LocationBlog", function () {

        it("should post a new locationBlog", async function () {
            const blog = {
                info: "Nice blog man!",
                pos: {
                    longitude: 34,
                    latitude: 76
                },
                author: testUser2._id
            }

            let res = await fetch(url_blogs, makeOptions("POST", blog))

            let json = await handleHttpErrors(res)


            expect(json.info).to.be.equal(blog.info)
        })

        it("should add a like to the post", async function () {
            let body = {
                blogId: testBlog1._id,
                username: testUser1.username
            }
            let res = await fetch(url_blogs, makeOptions("PUT", body))

            let blog = await handleHttpErrors(res)
            
            expect(blog.likedBy.length).to.be.equal(1)
        })


    })

    describe("UserFacade", function () {
        it("should contain two users", async function () {
            let res = await fetch(url_users)
            let users = await handleHttpErrors(res)

            expect(users.length).to.be.equal(2)
            expect(users[0].username).to.be.equal(testUser1.username)
        })

        it("should post a user", async function () {
            let user = {
                firstName: "Test3",
                lastName: "Test3",
                username: "test3",
                password: "1234",
                email: "test3@test.dk",
            }
            let res = await fetch(url_users, makeOptions("POST", user))
            let res_user = await handleHttpErrors(res)

            expect(user.username).to.be.equal(res_user.username)
        })

        it("should find user", async function () {
            let res = await fetch(url_users + testUser1.username)
            let user = await handleHttpErrors(res)

            expect(user.username).to.be.equal(testUser1.username)
        })

        it("should add job to user", async function () {
            let job = {
                type: "Program tester",
                company: "7Eleven",
                companyUrl: "7eleven.dk"
            }
            let res = await fetch(`${url_users}job/${testUser1.username}`, makeOptions("PUT", job))
            let user = await handleHttpErrors(res)

            expect(user.job[0].type).to.be.equal(job.type)
        })

    })

    describe("Login", function () {
        beforeEach(async function () {
            const body = {
                username: "test1",
                password: "1234",
                latitude: 31,
                longitude: 51,
                distance: 3000000
            }
            await fetch(`${url_login}`, makeOptions("post", body))
        })

        it("should log the user in with status code 200", async function () {
            const body = {
                username: "test1",
                password: "1234",
                latitude: 32,
                longitude: 53,
                distance: 3000000
            }
            let res = await fetch(`${url_login}`, makeOptions("post", body))
            expect(res.status).to.be.equal(200)
        })

        it("should have one and only one friend nearby", async function () {        
            const body = {
                username: "test2",
                password: "1234",
                latitude: 32,
                longitude: 52,
                distance: 3000000
            }
            let res = await fetch(`${url_login}`, makeOptions("post", body))
            let content = await res.json()
            expect(content.friends.length).to.be.equal(1)
        })

        it("should not be nearby friend",async function(){
            const body = {
                username: "test2",
                password: "1234",
                latitude: 32,
                longitude: 53,
                distance: 2
            }
            let res = await fetch(`${url_login}`, makeOptions("post", body))
            let content = await res.json()
            expect(content.friends.length).to.be.equal(0)
        })
    })
})