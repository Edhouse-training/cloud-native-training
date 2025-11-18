const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const redis = require('redis')

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379'
const REDIS_PASSWORD = process.env.REDIS_PASSWORD

console.log(`Redis URL: ${REDIS_URL}`)
console.log(`Redis authentication is ${REDIS_PASSWORD ? 'ENABLED' : 'DISABLED'}`)

const REDIS_KEY_MESSAGE = 'message'

const app = express()
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
const SERVER_PORT = 3000
const POD_NAME = process.env.POD_NAME || 'unknown'

const redisClient = redis.createClient({
    url: REDIS_URL,
    password: REDIS_PASSWORD
}).on('error', (err) => {
    console.error('Redis error: ', err)
})

app.use((req, res, next) => {
    console.log(`[${POD_NAME}] ${req.method} ${req.url}`)
    next();
})

app.get('/', async (req, res) => {
    var message = await getMessageFromRedis()
    if (message == null) {
        res.send('Hello My Backend!')
    } else {
        res.send(`Message saved on backend: ${message}`)
    }
})

const apiRouter = express.Router()

apiRouter.get('/get-message', async (req, res) => {
    const message = await getMessageFromRedis()
    createMessageResponse(res, message)
})

apiRouter.post('/save-message', async (req, res) => {
    const message = req.body.message
    await redisClient.set(REDIS_KEY_MESSAGE, message)
    const storedText = await getMessageFromRedis()
    createMessageResponse(res, storedText)
})

app.use('/api', apiRouter)

async function getMessageFromRedis() {
    try {
        return await redisClient.get(REDIS_KEY_MESSAGE)
    } catch (error) {
        return null
    }
}

function createMessageResponse(response, message) {
    response.json({ message: message })
}

;(async () => {
    console.log('Connecting to Redis')
    await redisClient.connect()
})()

app.listen(SERVER_PORT, () => {
    console.log(`Server is running on http://localhost:${SERVER_PORT}`)
})