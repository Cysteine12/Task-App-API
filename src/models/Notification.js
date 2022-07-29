const { Schema, model } = require('mongoose')

const notificationSchema = new Schema({
    senderId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    recieverId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    type: {
        type: String,
        enum: ['Follower'],
        required: true
    },
    body: {
        type: String,
        required: true
    },
    seen: {
        type: Boolean,
        default: false,
        required: true
    }
}, {
    timestamps: true
})

module.exports = model('Notification', notificationSchema)