const { body, query, validationResult } = require('express-validator')
const { StatusCodes } = require('http-status-codes')

const ValidationError = require('../utils/errors/ValidationError')

const validateUserName = body('name').exists().withMessage('Name is required').isAlpha().withMessage('Your name can only have letters').isLength({ min: 4, max: 150 }).withMessage('The length of your name must be between 4 and 150')
const validateUserNameOpt = body('name').optional().isAlpha().withMessage('Your name can only have letters').isLength({ min: 4, max: 150 }).withMessage('The length of your name must be between 4 and 150')

const validateUserEmail = body('email').exists().withMessage('Email is required').isEmail().withMessage('The email is not valid').isLength({ min: 1, max: 200 }).withMessage('The length of your email must be lower than 200 characters')

const validateUserPassword = body('password').exists().withMessage('Password is required').isLength({ min: 8, max: 16 }).withMessage('The length of your password must be between 8 and 16')
const validateUserPasswordOpt = body('password').optional().isLength({ min: 8, max: 16 }).withMessage('The length of your password must be between 8 and 16')

const validateEventTitle = body('title').exists().withMessage('Title is required').isLength({ min: 1, max: 100 }).withMessage('The length of the title must be between 1 and 100')
const validateEventTitleOpt = body('title').optional().isLength({ min: 1, max: 100 }).withMessage('The length of the title must be between 1 and 100')

const validateEventDescription = body('description').optional().isLength({ min: 1, max: 200 }).withMessage('The length of the description must be between 1 and 150')

const validateEventDate = body('date').exists().withMessage('Date is required').isISO8601().withMessage('The date is not valid')
const validateEventDateOpt = body('date').optional().isISO8601().withMessage('The date is not valid')

const validateEventDuration = body('duration').exists().withMessage('Duration is required').isInt({ min: 15, max: 600 }).withMessage('The duration is not valid, or not in the range of 15 to 600').custom((value) => value % 15 === 0).withMessage('The duration need to be a multiple of 15')
const validateEventDurationOpt = body('duration').optional().isInt({ min: 15, max: 600 }).withMessage('The duration is not valid, or not in the range of 15 to 600').custom((value) => value % 15 === 0).withMessage('The duration need to be a multiple of 15')

const validateInitDate = query('initDate').exists().withMessage('Initial Date is required').isISO8601().withMessage('The initial date is not valid')

const validateEndDate = query('endDate').exists().withMessage('End Date is required').isISO8601().withMessage('The end date is not valid')

const validate = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) throw new ValidationError({ code: StatusCodes.NOT_FOUND, message: 'Validation error', errors: errors.array() })
  next()
}

module.exports = {
  validateUserName,
  validateUserNameOpt,
  validateUserEmail,
  validateUserPassword,
  validateUserPasswordOpt,
  validateEventTitle,
  validateEventTitleOpt,
  validateEventDescription,
  validateEventDate,
  validateEventDateOpt,
  validateEventDuration,
  validateEventDurationOpt,
  validateInitDate,
  validateEndDate,
  validate
}
