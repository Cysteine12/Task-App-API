const { Schema, model } = require('mongoose')

const chatSchema = new Schema({
    userA: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    userB: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    message: {
        type: Array,
        default: [],
        required: true
    }
}, {
    timestamps: true
})

module.exports = model('Chat', chatSchema)