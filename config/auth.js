require('dotenv').config()
const { SECRET, ROUNDS } = process.env

module.exports = {
  secret: SECRET,
  rounds: ROUNDS
}
