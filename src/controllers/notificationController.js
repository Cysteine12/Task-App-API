const Notification = require('../models/Notification')


const index = async (req, res) => {
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

const showNotificationAlerts = async (req, res) => {
    try {
        const userId = req.user._id
        const data = await Notification.find({ 
            recieverId: userId,
            seen: false
        })
        .limit(10)
        .sort({ createdAt: -1 })

        res.status(200).json({ 
            success: true,
            data: data
        })
    } catch (err) {
        res.status(404).json({ err })
    }
}

const update = async (req, res) => {
    try {
        const notifications = await Notification.find({ 
            recieverId: req.user._id,
            seen: false
        })
        if (notifications) {
            await Promise.all(
                notifications.map(async (notification) => {
                    await Notification.updateOne({
                        _id: notification._id
                   }, {
                       seen: true
                   })
                })
            )
        }

        res.status(200).json({ 
            success: true
        })
    } catch (err) {
        res.status(404).json({ err })
    }
}


module.exports = {
    index,
    showNotificationAlerts,
    update
}