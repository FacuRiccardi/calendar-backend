const jwt = require('jsonwebtoken')
// const { StatusCodes } = require('http-status-codes')

const authConfig = require('../../config/auth')
const { AppError } = require('../utils/errors/AppError')
const {
  NOT_AUTHORIZED,
  TOKEN_VALIDATION_ERROR
} = require('../utils/constants/appErrors')

module.exports = (req, res, next) => {
  if (!req.headers.authorization) {
    throw new AppError(NOT_AUTHORIZED)
  } else {
    const token = req.headers.authorization.split(' ')[1]

    jwt.verify(token, authConfig.secret, (err, decoded) => {
      if (err) {
        throw new AppError(TOKEN_VALIDATION_ERROR)
      } else {
        req.user = decoded.user
        next()
      }
    })
  }
}
