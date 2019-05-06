var LocationBlog = require("../models/LocationBlog")

async function addLocationBlog(blog) {
    return await LocationBlog.create(blog)
}

async function likeLocationBlog(blogId, user) { 
    return await LocationBlog.findOneAndUpdate(
        { _id : blogId }, 
        { likedBy : user }, 
        {new: true})
}

module.exports = {
    addLocationBlog,
    likeLocationBlog,
}