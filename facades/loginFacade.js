const User = require('../models/User');
const Position = require('../models/Position');

async function login(username, password, longitude, latitude, distance) {
    console.log("We're in the backend");
    
    const user = await User.findOne({ username })

    if (user === null || user.password != password) {
        return { msg: 'wrong username or password', status: 403 };
    }

    const coordinates = [longitude, latitude]

    await Position.findOneAndUpdate(
        { _id: user._id },
        { user, created: Date.now(), loc: { type: 'Point', coordinates } },
        { upsert: true, new: true }
    ).exec()

    const nearbyFriends = await findAllNearbyFriends(coordinates, distance)

    return {
        friends: nearbyFriends.map(pos => {
            return {
                username: pos.user.username,
                latitude: pos.loc.coordinates[1],
                longitude: pos.loc.coordinates[0]
            }
        })
    }
}

async function findAllNearbyFriends(coordinates, distance) {
    return await Position.find(
        {
            loc:
            {
                $near:
                {
                    $geometry: { type: "Point", coordinates },
                    $minDistance: 0.1,
                    $maxDistance: distance
                }
            }
        }
    ).populate('user').exec()
}

module.exports = { login }