// -----------Back-end---------//
const express = require('express')
const router = express.Router()
const passport = require('passport')


// -----------Controller---------//
const PostController = require('../controllers/postController')


// -----------Router---------//

router.get(
    '/', 
    passport.authenticate('jwt', { session: false }), 
    PostController.index
)

router.get(
    '/owner/:ownerId', 
    passport.authenticate('jwt', { session: false }), 
    PostController.findByOwner
)

router.post(
    '/', 
    passport.authenticate('jwt', { session: false }), 
    PostController.store
)

router.get(
    '/:id', 
    passport.authenticate('jwt', { session: false }), 
    PostController.show
)

router.put(
    '/:id', 
    passport.authenticate('jwt', { session: false }), 
    PostController.update
)

router.delete(
    '/:id', 
    passport.authenticate('jwt', { session: false }), 
    PostController.destroy
)


module.exports = router