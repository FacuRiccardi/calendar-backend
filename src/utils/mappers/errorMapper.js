const { StatusCodes } = require('http-status-codes')

const validationErrorMapper = (error) => {
  const errors = {}

  error.errors.forEach((err) => {
    if (errors[err.path]) errors[err.path].push(err.message)
    else errors[err.path] = [err.message]
  })

  return {
    statusCode: StatusCodes.BAD_REQUEST,
    message: error.message,
    type: 'Validation Error',
    errors
  }
}

const uniqueConstraintErrorMapper = (error) => {
  const errors = {}

  error.errors.forEach((err) => {
    const errorMsg = `This ${err.path} is already in use`
    if (errors[err.path]) errors[err.path].push(errorMsg)
    else errors[err.path] = [errorMsg]
  })

  return {
    statusCode: StatusCodes.BAD_REQUEST,
    message: error.message,
    type: 'Unique Constraint Error',
    errors
  }
}

const appErrorMapper = (error) => {
  return {
    statusCode: error.statusCode,
    message: error.message,
    type: 'App error'
  }
}

const serverErrorMapper = (error) => {
  console.log(error)
  return {
    statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    message: 'Something went wrong',
    type: 'Unknown',
    error: process.env.NODE_ENV === 'development' ? error : undefined
  }
}

module.exports = {
  validationErrorMapper,
  uniqueConstraintErrorMapper,
  appErrorMapper,
  serverErrorMapper
}
