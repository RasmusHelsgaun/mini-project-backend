var connect = require("./dbConnect.js");
connect(require("./settings").DEV_DB_URI);

var User = require("./models/User.js");
var LocationBlog = require("./models/LocationBlog.js");
var Position = require("./models/Position.js");
var userFacade = require("./facades/userFacade")
var blogFacade = require("./facades/blogFacade")

function positionCreator(lon, lat, userId, dateInFuture) {
  var posDetail = { user: userId, loc: { coordinates: [lon, lat] } }
  if (dateInFuture) {
    posDetail.created = "2022-09-25T20:40:21.899Z"
  }
  return posDetail;
}
async function makeData() {
  console.log("Making users")
  try {
    var userInfos = [
      {
        firstName: "Kurt", lastName: "Wonnegut", username: "kurt", password: "test", email: "kurt@wonnegut.dk",
        job: [{ type: "a", company: "A", companyUrl: "a.dk" },
        { type: "aa", company: "AA", companyUrl: "aa.dk" }]
      },
      {
        firstName: "Hanne", lastName: "Wonnegut", username: "hanne", password: "test", email: "hanne@wonnegut.dk",
        job: [{ type: "b", company: "B", companyUrl: "b.dk" },
        { type: "bb", company: "BB", companyUrl: "bb.dk" }]
      },
      {
        firstName: "Jeppe", lastName: "Wonnegut", username: "jeppe", password: "test", email: "jeppe@wonnegut.dk",
        job: [{ type: "c", company: "C", companyUrl: "c.dk" },
        { type: "cc", company: "CC", companyUrl: "cc.dk" }]
      }
    ];
    await User.deleteMany({});
    await Position.deleteMany({});
    await LocationBlog.deleteMany({})

    var users = await User.insertMany(userInfos);
    var usr = await userFacade.addUser({
      firstName: "Rasmus", lastName: "Helsgaun", username: "ralle", password: "test", email: "rasmus@helsgaun.dk",
      job: [{ type: "Boss", company: "TechGenious", companyUrl: "tg.dk" },
      { type: "Support", company: "Matas", companyUrl: "matas.dk" }]
    })

    console.log(users);
    console.log(usr);

    var positions = [positionCreator(10, 11, users[0]._id, true), positionCreator(11, 12, users[1]._id, true)]
    await Position.insertMany(positions)

    var blogs = [{ info: "Cool Place", pos: { longitude: 26, latitude: 57 }, author: users[0]._id }]
    var blgs = await LocationBlog.insertMany(blogs)

    var blg = await blogFacade.likeLocationBlog(blgs[0]._id, usr)
    console.log(blg);
    

  } catch (err) {
    console.log(err);
  }
}
makeData();