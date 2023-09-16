const express = require('express')
const { sequelize } = require('./models/index')

const app = express()

// Settings
const port = process.env.PORT || 3000

// Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// Routes
app.use(require('./routes/users'))

// ErrorHandler
app.use(require('./middlewares/errorHandler'))

app.listen(port, () => {
  console.log(`App is listening at http://localhost:${port}`)

  sequelize.authenticate().then(() => {
    console.log('Connection to the Database successfull!')
  })
})
