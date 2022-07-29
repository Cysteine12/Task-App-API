// -----------Back-end---------//
const express = require('express')
const router = express.Router()
const passport = require('passport')

// -----------Controller---------//
const ChatController = require('../controllers/chatController')


// -----------Router---------//

router.get(
    '/get-chat-list-alert',
    passport.authenticate('jwt', { session: false }), 
    ChatController.getChatListAlerts
)

router.get(
    '/get-chat-list',
    passport.authenticate('jwt', { session: false }), 
    ChatController.getChatList
)

router.post(
    '/get-chat',
    passport.authenticate('jwt', { session: false }), 
    ChatController.getChat
)

router.put(
    '/save-chat',
    passport.authenticate('jwt', { session: false }), 
    ChatController.saveChat
)


module.exports = router