const User = require('../models/User');
const Position = require('../models/Position');

async function login(username, password, longitude, latitude, distance) {
    const user = await User.findOne({ username, password })

    if (user === null || user.password != password) {
        return { msg: 'wrong username or password', status: 403 };
    }

    let pos = await Position.findOneAndUpdate(
        { user: user._id },
        { loc: { type: 'Point', coordinates: [longitude, latitude] }, created: Date.now() },
        { upsert: true, new: true }
    )

    const nearbyFriends = await findAllNearbyFriends(pos, distance)

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

async function findAllNearbyFriends(pos, distance) {
    return await Position.find(
        {
            // user: { $ne: pos.user },
            loc:
            {
                $near:
                {
                    $geometry: pos.loc,
                    $minDistance: 0.1,
                    $maxDistance: distance
                }
            }
        }
    ).populate('user')
}

module.exports = { login }