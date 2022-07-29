// -----------Back-end---------//
const express = require('express')
const router = express.Router()
const passport = require('passport')

// -----------Controller---------//
const AuthController = require('../controllers/authController')

// -----------Middleware---------//
const upload = require('../middlewares/upload-photo')


// -----------Router---------//

router.get('/', AuthController.index)

router.post(
    '/register', 
    AuthController.register
)

router.post('/login', AuthController.login)

router.get(
    '/profile', 
    passport.authenticate('jwt', { session: false }), 
    AuthController.profile
)

router.put(
    '/update/:id', 
    passport.authenticate('jwt', { session: false }), 
    AuthController.update
)

router.put(
    '/update-photo/:id', 
    upload.single('photo'),
    passport.authenticate('jwt', { session: false }), 
    AuthController.updatePhoto
)

router.delete(
    '/delete', 
    passport.authenticate('jwt', { session: false }), 
    AuthController.destroy
)


module.exports = router