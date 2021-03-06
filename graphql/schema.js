const resolvers = require("./resolvers")
const { makeExecutableSchema } = require("graphql-tools")

const typeDefs = `
    scalar DateTime
    type JobSchema {
        type: String
        company: String
        companyUrl: String
    }
    type User {
        id: ID
        firstName: String
        lastName: String
        username: String
        email: String
        job: [JobSchema]
        created: DateTime
        lastUpdated: DateTime
    }
    type Friend {
        username: String
        latitude: Float
        longitude: Float
    }
    type Position{
        latitude: Float
        longitude: Float
    }
    type Blog{
        info: String
        img: String
        pos: Position
        author: User
        created: DateTime
        lastUpdated: DateTime
        likedBy: [User]
    }
    input UserInput {
        firstName: String!
        lastName: String!
        username: String!
        password: String!
        email: String!
    }
    input LoginInput{
        username: String!
        password: String!
        longitude: Float!
        latitude: Float!
        distance: Int
    }
    input LikeInput{
        blogId: ID!
        username: String!
    }
    
    type Query {
        getAllUsers: [User]
        findUserByUsername(username: String!): User
    }
    type Mutation {
        login(input: LoginInput): [Friend]
        removeUser(id: ID): String
        addUser(user: UserInput): User
        likeLocationBlog(input: LikeInput): Blog
    }
`
const schema = makeExecutableSchema({ typeDefs, resolvers })

module.exports = { schema, typeDefs, resolvers }