const jwt = require('jsonwebtoken')
// const { StatusCodes } = require('http-status-codes')

const { User } = require('../models/index')
const authConfig = require('../../config/auth')
const AppError = require('../utils/errors/AppError')
const {
  NOT_AUTHORIZED,
  TOKEN_VALIDATION_ERROR,
  USER_NOT_FOUND
} = require('../utils/constants/appErrors')

module.exports = (req, res, next) => {
  if (!req.headers.authorization) {
    next(new AppError(NOT_AUTHORIZED))
  } else {
    const token = req.headers.authorization.split(' ')[1]

    jwt.verify(token, authConfig.secret, async (err, decoded) => {
      if (err) {
        next(new AppError(TOKEN_VALIDATION_ERROR))
      } else {
        const user = await User.findOne({ where: { id: decoded.id } })

        if (!user) next(new AppError(USER_NOT_FOUND))

        req.user = user

        next()
      }
    })
  }
}
