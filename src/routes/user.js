// -----------Back-end---------//
const express = require('express')
const router = express.Router()
const passport = require('passport')

// -----------Controller---------//
const UserController = require('../controllers/userController')


// -----------Router---------//

router.put(
    '/follow',
    passport.authenticate('jwt', { session: false }), 
    UserController.follow
)

router.get(
    '/timeline/:userId',
    passport.authenticate('jwt', { session: false }), 
    UserController.timeline
)

router.get(
    '/profile/:id',
    passport.authenticate('jwt', { session: false }), 
    UserController.profile
)

router.get(
    '/get-event',
    passport.authenticate('jwt', { session: false }), 
    UserController.getEvent
)

router.put(
    '/save-event',
    passport.authenticate('jwt', { session: false }), 
    UserController.saveEvent
)

router.get(
    '/get-notification',
    passport.authenticate('jwt', { session: false }), 
    UserController.getNotification
)

router.get(
    '/get-chat-list',
    passport.authenticate('jwt', { session: false }), 
    UserController.getChatList
)

router.post(
    '/get-chat',
    passport.authenticate('jwt', { session: false }), 
    UserController.getChat
)

router.put(
    '/save-chat',
    passport.authenticate('jwt', { session: false }), 
    UserController.saveChat
)

router.get(
    '/search/:name',
    passport.authenticate('jwt', { session: false }), 
    UserController.search
)


module.exports = router