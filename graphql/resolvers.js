const userFacade = require("../facades/userFacade")
const loginFacade = require("../facades/loginFacade")
const blogFacade = require("../facades/blogFacade")
const { DateTime } = require("@okgrow/graphql-scalars")


// resolver map
module.exports = {
    DateTime,
    Query: {
        async getAllUsers() {
            return await userFacade.getAllUsers()
        },
        findUserByUsername(root, { username }) {
            return userFacade.findByUsername(username)
        },
    },
    Mutation: {
        login(root, { input }) {
            const { username, password, latitude, longitude, distance } = input
            return loginFacade.login(username, password, latitude, longitude, distance)
        },
        async removeUser(root, { id }) {
            await userFacade.removeUser(id)
            return "Successfully deleted user"
        },
        addUser(root, { user }) {
            try{
                console.log(user);
                
                return userFacade.addUser(user)
            }catch (err){
                return "Error"
            }
        },
        async likeLocationBlog(root, { input }) {
            var { blogId, username } = input
            
            var user = await userFacade.findByUsername(username)
            return blogFacade.likeLocationBlog(blogId, user)
        }
    }
}