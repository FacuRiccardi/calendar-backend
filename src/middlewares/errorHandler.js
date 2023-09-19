const { StatusCodes } = require('http-status-codes')
const { UniqueConstraintError } = require('sequelize')
const { validationErrorMapper, uniqueConstraintErrorMapper, appErrorMapper, serverErrorMapper } = require('../utils/mappers/errorMapper')

const AppError = require('../utils/errors/AppError')
const ValidationError = require('../utils/errors/ValidationError')

const errorHandler = (error, req, res, next) => {
  switch (error.constructor) {
    case ValidationError:
      return res.status(StatusCodes.BAD_REQUEST).json(validationErrorMapper(error))
    case UniqueConstraintError:
      return res.status(StatusCodes.BAD_REQUEST).json(uniqueConstraintErrorMapper(error))
    case AppError:
      return res.status(error.statusCode).json(appErrorMapper(error))
    default:
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(serverErrorMapper(error))
  }
}

module.exports = errorHandler
