const express = require('express')
const cors = require('cors')
const passport = require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const connectDB = require('./config/connect')

const app = express()


//=======Config========//
if (process.env.NODE_ENV !== 'production') {
    const dotenv = require('dotenv')
    const morgan = require('morgan')
    dotenv.config({ path: './config/config.env' })
    app.use(morgan('dev'))
}

connectDB()


//=======Middleware======//
app.use(
    cors({
        origin: process.env.ORIGIN_URL,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: 'Accept, Accept-Language, Content-Language, Content-Type, Origin, Authorization',
        optionsSuccessStatus: 200
    })
)
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use(session({
    secret: process.env.SESS_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI
    })
}))

require('./config/passport-jwt')(passport)
app.use(passport.initialize())
app.use(passport.session())

//=======Routes========//
const auth = require('./src/routes/auth')
app.use('/api/auth', auth)

const user = require('./src/routes/user')
app.use('/api/user', user)

const post = require('./src/routes/post')
app.use('/api/post', post)

const chat = require('./src/routes/chat')
app.use('/api/chat', chat)

const notification = require('./src/routes/notification')
app.use('/api/notification', notification)


//=======........========//
const port = process.env.PORT || 5000

app.listen(port, console.log(`Server started on port ${port}`))
