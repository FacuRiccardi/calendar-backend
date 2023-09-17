const { StatusCodes } = require('http-status-codes')

module.exports = {
  USER_NOT_FOUND: { code: StatusCodes.NOT_FOUND, message: 'User not found' },
  EVENT_NOT_FOUND: { code: StatusCodes.NOT_FOUND, message: 'Event not found' },
  WRONG_PASSWORD: { code: StatusCodes.BAD_REQUEST, message: 'Wrong password' },
  NOT_AUTHORIZED: { code: StatusCodes.NOT_AUTHORIZED, message: 'Not authorized' },
  TOKEN_VALIDATION_ERROR: { code: StatusCodes.INTERNAL_SERVER_ERROR, message: 'Something went wrong with the token validation' },
  SERVER_ERROR: { code: StatusCodes.INTERNAL_SERVER_ERROR, message: 'Something went wrong' }
}
