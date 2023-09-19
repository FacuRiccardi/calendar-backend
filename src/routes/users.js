const express = require('express')
const { errorCatcher } = require('../utils/errors/errorCatcher')
const { validateUserName, validateUserNameOpt, validateUserEmail, validateUserPassword, validateUserPasswordOpt, validate } = require('../middlewares/validator')

const router = express.Router()

// Middlewares
const auth = require('../middlewares/auth')

// Controllers
const UserController = require('../controllers/users')

router.post(
  '/api/signup',
  [validateUserName, validateUserEmail, validateUserPassword, validate],
  errorCatcher(UserController.signUp)
)
router.post(
  '/api/signin',
  [validateUserEmail, validateUserPassword, validate],
  errorCatcher(UserController.signIn)
)
router.get('/api/user', auth, errorCatcher(UserController.getUser))
router.patch(
  '/api/user',
  auth,
  [validateUserNameOpt, validateUserPasswordOpt, validate],
  errorCatcher(UserController.updateUser)
)
router.delete('/api/user', auth, errorCatcher(UserController.deleteUser))

module.exports = router
