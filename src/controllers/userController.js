const User = require('../models/User')
const Post = require('../models/Post')
const Notification = require('../models/Notification')
const Chat = require('../models/Chat')

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
                    const notification = new Notification({
                        senderId: req.user._id,
                        recieverId: req.body.following,
                        type: 'Follower',
                        body: 'Hey, ' + req.user.name + ' is now following you',
                    })
                    await notification.save()
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
        const myPosts = await Post.find({ userId: req.params.userId }).sort({ createdAt: -1 })
        const userFollowings = await Promise.all(
            user.following.map(followingId => {
                return Post.find({ userId: followingId }).sort({ createdAt: -1 })
            })
        )
        const data = [...new Set(myPosts.concat(...userFollowings))]

        res.status(200).json({ 
            success: true,
            data: data
        })
    } catch (err) {
        res.status(404).json({ err })
    }
}

const profile = async (req, res) => {
    try {
        const { id } = req.params
        const data = await User.findById(id)
        const user = {
            _id: data._id,
            name: data.name,
            email: data.email,
            phone: data.phone,
            photo: data.photo,
            follower: data.follower,
            following: data.following
        }

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
        const userEvents = await Promise.all(
            user.savedEvent.map(eventId => {
                return Post.find({ _id: eventId }).sort({ createdAt: -1 })
            })
        )
        res.status(200).json({ 
            success: true,
            data: userEvents
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

const getNotification = async (req, res) => {
    try {
        const userId = req.user._id
        const data = await Notification.find({ recieverId: userId }).sort({ createdAt: -1 })

        res.status(200).json({ 
            success: true,
            data: data
        })
    } catch (err) {
        res.status(404).json({ err })
    }
}

const getChatList = async (req, res) => {
    try {
        const userId = req.user._id
        const chats = await Chat.find({
            $or: [
                {
                    userA: userId
                },
                {
                    userB: userId
                }
            ]
        })
        const newChats = await Promise.all(
            chats.map(async (chat) => {
                let id = null
                if (chat.userA != userId) {
                    id = chat.userB
                } else {
                    id = chat.userA
                }
                const user = await User.findById(id).select('name')
                const message = chat.message[chat.message.length - 1].message
                const trimMessage = message.split(' ').slice(0, 6).join(' ')

                return {
                    _id: chat._id,
                    name: user.name,
                    userA: chat.userA,
                    userB: chat.userB,
                    message: trimMessage,
                    createdAt: chat.createdAt
                }
            })
        )
        res.status(200).json({ 
            success: true,
            data: newChats
        })
    } catch (err) {
        res.status(404).json({ err })
    }
}

const getChat = async (req, res) => {
    try {
        const userId = req.user._id
        const friendId = req.body.friendId
        const data = await Chat.findOne({
            $or: [
                {
                    userA: userId,
                    userB: friendId,
                },
                {
                    userA: friendId,
                    userB: userId,
                }
            ]
        })
        
        res.status(200).json({ 
            success: true,
            data: data
        })
    } catch (err) {
        res.status(404).json({ err })
    }
}

const saveChat = async (req, res) => {
    try {
        const { friendId, message } = req.body
        const userId = req.user._id

        const data = await Chat.findOne({
            $or: [
                {
                    userA: userId,
                    userB: friendId,
                },
                {
                    userA: friendId,
                    userB: userId,
                }
            ]
        })
        if (data == null) {
            const chat = new Chat({
                userA: userId,
                userB: friendId,
                message: {
                    userId: userId,
                    message: message,
                    createdAt: Date.now()
                }
            })
            await chat.save()
        } else {
            await Chat.findOneAndUpdate({
                $or: [
                    {
                        userA: userId,
                        userB: friendId,
                    },
                    {
                        userA: friendId,
                        userB: userId,
                    }
                ]
            }, {
                $push: { 
                    message: {
                        userId: userId,
                        message: message,
                        createdAt: Date.now()
                    }
                }
            })
        }
        

        res.status(200).json({ 
            success: true,
            msg: 'Message sent!'
        })
    } catch (err) {
        res.status(404).json({ err })
    }
}

const search = async (req, res) => {
    try {
        const { name } = req.params
        const data = await User.find({
            $text: {
                $search: name
            }
        })

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
    getNotification,
    getChatList,
    getChat,
    saveChat,
    search
}