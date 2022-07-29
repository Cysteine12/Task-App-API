const mongoose = require('mongoose')
const User = require('../models/User')
const Post = require('../models/Post')
const Notification = require('../models/Notification')


const follow = async (req, res) => {
    try {
        const { action, following } = req.body
        const user = req.user
        let data = ''
        
        switch(action) {
            case 'follow':
                if(!user.following.includes(following)) {
                    await Promise.all([
                        User.findByIdAndUpdate(user._id, {
                            $push: { following }
                        }),
                        User.findByIdAndUpdate(following, {
                            $push: { follower: user._id }
                        })
                    ])
                    const isExist = await Notification.findOne({ 
                        senderId: req.user._id,
                        recieverId: req.body.following,
                        type: 'Follower'
                    })
                    if (!isExist) {
                        const notification = new Notification({
                            senderId: req.user._id,
                            recieverId: req.body.following,
                            type: 'Follower',
                            body: 'Hey, ' + req.user.name + ' is now following you',
                        })
                        await notification.save()
                    }
                    data = 'Done!'
                } else {
                    data = 'Already following'
                }
                break;

            case 'unfollow':
                if(user.following.includes(following)) {
                    await Promise.all([
                        User.findByIdAndUpdate(user._id, {
                            $pull: { following }
                        }),
                        User.findByIdAndUpdate(following, {
                            $pull: { follower: user._id }
                        })
                    ])
                    data = 'Done!'
                } else {
                    data = 'Already Unfollowed'
                }
                break;
            default:
                break;
        }

        res.status(200).json({ 
            success: true,
            data: data
        })
    } catch (err) {
        res.status(404).json({ err })
    }
}

const timeline = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId)
        user.following.push(String(user._id))
        const postsId = user.following.map(followingId => {
            return new mongoose.Types.ObjectId(followingId)
        })

        const postCount = await Post.find({
            userId: {
                $in: user.following
            }
        }).count('postCount')

        const data = await Post.aggregate([
            {
                $match: {
                    userId: {
                        $in: postsId
                    }
                }
            },
            {
                $sort: {
                    createdAt: -1
                }
            },
            {
                $skip: (req.params.pageId - 1) * 2
            },
            {
                $limit: 2
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            {
                $unwind: '$user'
            },
            {
                $project: {
                    'user._id': 0,
                    'user.email': 0,
                    'user.password': 0,
                    'user.phone': 0,
                    'user.follower': 0,
                    'user.following': 0,
                    'user.savedEvent': 0,
                    'user.createdAt': 0,
                    'user.updatedAt': 0
                }
            }
        ])

        res.status(200).json({ 
            success: true,
            data: { data, postCount }
        })
    } catch (err) {
        res.status(404).json({ err })
    }
}

const profile = async (req, res) => {
    try {
        const { id } = req.params
        const user = await User.findById(id)
        .select('_id name email phone photo follower following')

        res.status(200).json({ 
            success: true,
            user: user
        })
    } catch (err) {
        res.status(200).json({ err })
    }
}

const getEvent = async (req, res) => {
    try {
        const user = req.user
        const eventsId = user.savedEvent.map(savedEventId => {
            return new mongoose.Types.ObjectId(savedEventId)
        })

        const eventCount = user.savedEvent.length
        
        const data = await Post.aggregate([
            {
                $match: {
                    _id: {
                        $in: eventsId
                    } 
                }
            },
            {
                $sort: {
                    createdAt: -1
                }
            },
            {
                $skip: (req.params.pageId - 1) * 2
            },
            {
                $limit: 2
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            {
                $unwind: '$user'
            },
            {
                $project: {
                    'user._id': 0,
                    'user.email': 0,
                    'user.password': 0,
                    'user.phone': 0,
                    'user.follower': 0,
                    'user.following': 0,
                    'user.savedEvent': 0,
                    'user.createdAt': 0,
                    'user.updatedAt': 0
                }
            }
        ])

        res.status(200).json({ 
            success: true,
            data: { data, eventCount }
        })
    } catch (err) {
        res.status(404).json({ err })
    }
}

const saveEvent = async (req, res) => {
    try {
        const { event_id, action } = req.body
        const user = req.user
        let data = ''
        
        switch(action) {
            case 'save':
                if (!user.savedEvent.includes(event_id)) {
                    await User.findByIdAndUpdate(user._id, {
                        $push: { savedEvent: event_id }
                    }) 
                    data = 'Saved!'
                } else {
                    data = 'Already saved!'
                }
                break;

            case 'unsave':
                if (user.savedEvent.includes(event_id)) {
                    await User.findByIdAndUpdate(user._id, {
                        $pull: { savedEvent: event_id }
                    }) 
                    data = 'Removed!'
                } else {
                    data = 'Already removed!'
                }
                break;

            default:
                break;
        }

        res.status(200).json({ 
            success: true,
            data: data
        })
    } catch (err) {
        res.status(404).json({ err })
    }
}

const follower = async (req, res) => {
    try {
        const userId = req.params.userId
        const user = await User.findById(userId).select('follower')
        
        const data = await User.find({
            _id: {
                $in: user.follower
            } 
        }).select('_id name photo').sort({ createdAt: -1 })

        res.status(200).json({ 
            success: true,
            data: data
        })
    } catch (err) {
        res.status(404).json({ err })
    }
}

const following = async (req, res) => {
    try {
        const userId = req.params.userId
        const user = await User.findById(userId).select('following')
        
        const data = await User.find({
            _id: {
                $in: user.following
            } 
        }).select('_id name photo').sort({ createdAt: -1 })

        res.status(200).json({ 
            success: true,
            data: data
        })
    } catch (err) {
        res.status(404).json({ err })
    }
}

const search = async (req, res) => {
    try {
        const { name } = req.params
        const { _id } = req.user
        const data = await User.find({
            $text: {
                $search: name
            },
            _id: {
                $nin: [_id]
            }
        }).select('_id name photo')

        res.status(200).json({ 
            success: true,
            data: data
        })
    } catch (err) {
        res.status(200).json({ err })
    }
}


module.exports = {
    follow,
    timeline,
    profile,
    getEvent,
    saveEvent,
    follower,
    following,
    search
}