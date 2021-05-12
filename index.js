const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session")
const redis = require("redis")
const cors = require("cors")
let RedisStore = require("connect-redis")(session)
const { SESSION_SECRET, REDIS_PORT, REDIS_URL, MONGO_USER, MONGO_PASSWORD, MONGO_IP, MONGO_PORT } = require("./config/config");

let redisClient = redis.createClient({
    host: REDIS_URL, 
    port: REDIS_PORT
})

const postRouter = require("./routes/postRoutes")
const userRouter = require("./routes/userRoutes")

const app = express();

const mongoURL = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`

const connectWithRetry = () => {
    mongoose
    .connect(mongoURL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    })
    .then(() => console.log("Succesfully connected to DB"))
    .catch((e) => {
        console.log(e)
        // If we cannot connect, we will wait 5s and try again
        setTimeout(connectWithRetry, 500)
    })
}

connectWithRetry();

app.enable("trust proxy")
// Middleware for sessions
app.use(cors({}))
// Cors: allows your front-end to run on one domain and the back-enf on a different domain
app.use(session({
    store: new RedisStore({client: redisClient}),
    secret: SESSION_SECRET,
    cookie: {
        secure: false,
        resave: false,
        saveUninitialized: false,
        httpOnly: true,
        maxAge: 30000
    }
}))


// Assures that the body gets attached to the request object
app.use(express.json())

app.get("/api/v1", (req, res) => {
    res.send("<h2> Hi there!!!!!</h2>");
    console.log("yeah it ran")
})

app.use("/api/v1/posts", postRouter)
app.use("/api/v1/users", userRouter)
const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`listening on port ${port}`))