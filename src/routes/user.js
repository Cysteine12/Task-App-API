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
    '/timeline/:userId/:pageId?',
    passport.authenticate('jwt', { session: false }), 
    UserController.timeline
)

router.get(
    '/profile/:id',
    passport.authenticate('jwt', { session: false }), 
    UserController.profile
)

router.get(
    '/get-event/:pageId?',
    passport.authenticate('jwt', { session: false }), 
    UserController.getEvent
)

router.put(
    '/save-event',
    passport.authenticate('jwt', { session: false }), 
    UserController.saveEvent
)

router.get(
    '/get-follower/:userId',
    passport.authenticate('jwt', { session: false }), 
    UserController.follower
)

router.get(
    '/get-following/:userId',
    passport.authenticate('jwt', { session: false }), 
    UserController.following
)

router.get(
    '/search/:name',
    passport.authenticate('jwt', { session: false }), 
    UserController.search
)


module.exports = router