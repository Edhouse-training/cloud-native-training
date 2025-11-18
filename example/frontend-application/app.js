const express = require('express')
const path = require('path')

const API_BASE_URL = process.env.API_BASE_URL

const app = express()
const SERVER_PORT = 3001

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.get('/', (req, res) => {
    res.render('index', {
        apiBaseUrl: API_BASE_URL
    });
});

app.listen(SERVER_PORT, () => {
    console.log(`API_BASE_URL: ${API_BASE_URL}`)
    console.log(`SERVER_PORT: ${SERVER_PORT}`)
})