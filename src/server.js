const app = require('./app')
const { sequelize } = require('./models')

// Settings
const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(`App is listening at http://localhost:${port}`)

  sequelize.authenticate().then(() => {
    console.log('Connection to the Database successfull!')
  })
})
