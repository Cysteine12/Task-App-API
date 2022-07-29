const { Schema, model } = require('mongoose')

const postSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    course: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    notes: {
        type: String,
        required: true,
    },
    teacher: {
        type: String,
        required: true,
    },
    deadline: {
        type: Date,
        required: true,
    }
}, {
    timestamps: true
})

module.exports = model('Post', postSchema)