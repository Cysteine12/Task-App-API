// -----------Back-end---------//
const express = require('express')
const router = express.Router()
const passport = require('passport')

// -----------Controller---------//
const NotificationController = require('../controllers/notificationController')


// -----------Router---------//

router.get(
    '/',
    passport.authenticate('jwt', { session: false }), 
    NotificationController.index
)

router.get(
    '/alerts',
    passport.authenticate('jwt', { session: false }), 
    NotificationController.showNotificationAlerts
)

router.put(
    '/update', 
    passport.authenticate('jwt', { session: false }), 
    NotificationController.update
)


module.exports = router