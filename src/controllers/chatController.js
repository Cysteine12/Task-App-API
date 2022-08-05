const User = require('../models/User')
const Chat = require('../models/Chat')


const getChatListAlerts = async (req, res) => {
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
        }).limit(10).sort({ createdAt: -1 })

        const newChats = await Promise.all(
            chats.map(async (chat) => {
                let id = null
                id = String(userId) === String(chat.userA) ? chat.userB : chat.userA

                const user = await User.findById(id).select('name photo')
                const message = chat.message[chat.message.length - 1].message
                const trimMessage = message.split(' ').slice(0, 4).join(' ')

                return {
                    _id: chat._id,
                    name: user.name,
                    photo: user.photo,
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
        }).sort({ updatedAt: -1 })
        
        const newChats = await Promise.all(
            chats.map(async (chat) => {
                let id = null
                id = String(userId) === String(chat.userA) ? chat.userB : chat.userA
                
                const user = await User.findById(id).select('name photo')
                const message = chat.message[chat.message.length - 1].message
                const trimMessage = message.split(' ').slice(0, 4).join(' ')

                return {
                    _id: chat._id,
                    name: user.name,
                    photo: user.photo,
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
        const chat = await Chat.findOne({
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
        const friendData = await User.findById(friendId).select('_id name photo')
        
        res.status(200).json({ 
            success: true,
            data: {
                chat, 
                friendData
            }
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
                },
                updatedAt: Date.now()
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


module.exports = {
    getChatListAlerts,
    getChatList,
    getChat,
    saveChat
}