const express = require('express')
const cors = require('cors')

const app = express()

// Middlewares
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// Routes
app.use(require('./routes/users'))
app.use(require('./routes/events'))

// ErrorHandler
app.use(require('./middlewares/errorHandler'))

module.exports = app
