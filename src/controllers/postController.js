const Post = require('../models/Post')
const User = require('../models/User')

const index = async (req, res) => {
    try {
        const data = await Post.find().sort({ createdAt: -1 })
        
        res.status(200).json({ 
            success: true,
            data: data
        })
    } catch (err) {
        res.status(200).json({ err })
    }
}

const findByOwner = async (req, res) => {
    try {
        const { ownerId } = req.params
        const owner = await User.findById(ownerId).select('name photo')
        const postCount = await Post.find({
            userId: ownerId
        }).count('postCount')

        const posts = await Post.find({ 
            userId: ownerId 
        }).sort({ createdAt: -1 }).skip((req.params.pageId - 1) * 2).limit(2)

        const data = posts.map(post =>{
            return {
                _id: post._id,
                userId: post.userId,
                course: post.course,
                title: post.title,
                notes: post.notes,
                teacher: post.teacher,
                deadline: post.deadline,
                createdAt: post.createdAt,
                user: { 
                    name: owner.name,
                    photo: owner.photo
                }
            }
        })

        res.status(200).json({ 
            success: true,
            data: { data, postCount }
        })
    } catch (err) {
        res.status(200).json({ err })
    }
}

const store = async (req, res) => {
    try {
        const post = new Post({
            userId: req.user._id,
            title: req.body.title,
            course: req.body.course,
            notes: req.body.notes,
            teacher: req.body.teacher,
            deadline: req.body.deadline
        })
        const data = await post.save()

        res.status(200).json({ 
            success: true,
            msg: 'Post posted successfully',
            data: data
        })
    } catch (err) {
        res.status(200).json({ err })
    }
}

const show = async (req, res) => {
    try {
        const { id } = req.params
        const data = await Post.findById(id)

        res.status(200).json({ 
            success: true,
            data: data
        })
    } catch (err) {
        res.status(200).json({ err })
    }
}

const update = async (req, res) => {
    try {
        const { id } = req.params
        const post = {
            userId: req.user._id,
            title: req.body.title,
            course: req.body.course,
            notes: req.body.notes,
            teacher: req.body.teacher,
            deadline: req.body.deadline
        }
        const data = await Post.updateOne({ _id: id}, post)

        res.status(200).json({ 
            success: true,
            msg: 'Post updated successfully',
            data: data
        })
    } catch (err) {
        res.status(200).json({ err })
    }
}

const destroy = async (req, res) => {
    try {
        const { id } = req.params
        await Post.findByIdAndDelete(id)

        res.status(200).json({
            success: true,
            msg: 'Delete Successful!' 
        })
    } catch (err) {
        res.status(200).json({ err })
    }
}


module.exports = {
    index,
    findByOwner,
    store,
    show,
    update,
    destroy
}