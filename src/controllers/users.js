const jwt = require('jsonwebtoken')
const { StatusCodes } = require('http-status-codes')

const { User } = require('../models/index')
const AppError = require('../utils/errors/AppError')
const authConfig = require('../../config/auth')
const {
  USER_NOT_FOUND,
  WRONG_PASSWORD
} = require('../utils/constants/appErrors')

const signUp = async (req, res) => {
  const { name, email, password } = req.body

  const user = await User.create({
    name,
    email,
    password
  })

  const token = jwt.sign({
    id: user.id,
    email: user.email
  }, authConfig.secret, { expiresIn: '1d' })

  res.status(StatusCodes.CREATED).json({ name: user.name, email: user.email, token })
}

const signIn = async (req, res) => {
  const { email, password } = req.body

  const user = await User.findOne({ where: { email } })

  if (!user) throw new AppError(USER_NOT_FOUND)
  else {
    if (!(await user.validPassword(password))) {
      throw new AppError(WRONG_PASSWORD)
    } else {
      const token = jwt.sign({
        id: user.id,
        email: user.email
      }, authConfig.secret, { expiresIn: '1d' })

      res.status(StatusCodes.OK).json({ name: user.name, email: user.email, token })
    }
  }
}

const getUser = async (req, res) => {
  const user = req.user

  res.status(StatusCodes.OK).json({ name: user.name, email: user.email })
}

const updateUser = async (req, res) => {
  const user = req.user

  const { name, password } = req.body

  const updatedUser = {
    name: name || user.name,
    password: password || user.password
  }

  await user.update({ ...updatedUser })

  res.status(StatusCodes.OK).json({ name: user.name, email: user.email })
}

const deleteUser = async (req, res) => {
  const user = req.user

  await user.destroy()

  res.status(StatusCodes.NO_CONTENT).json({})
}

module.exports = {
  signUp,
  signIn,
  getUser,
  updateUser,
  deleteUser
}
