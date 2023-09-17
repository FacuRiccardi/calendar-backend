const { StatusCodes } = require('http-status-codes')
const { Op } = require('sequelize')

const { Event, User } = require('../models/index')
const AppError = require('../utils/errors/AppError')
const { USER_NOT_FOUND, EVENT_NOT_FOUND } = require('../utils/constants/appErrors')
const eventMapper = require('../utils/mappers/eventMapper')

const createEvent = async (req, res) => {
  const { id } = req.user
  const { title, description, date, duration } = req.body

  const user = await User.findOne({ where: { id } })

  if (!user) throw new AppError(USER_NOT_FOUND)
  else {
    const event = await Event.create({
      title,
      description,
      date,
      duration,
      userId: user.id
    })

    res.status(StatusCodes.CREATED).json(eventMapper(event))
  }
}

const getEvents = async (req, res) => {
  const { id } = req.user
  const { initDate, endDate } = req.query

  const user = await User.findOne({ where: { id } })

  if (!user) throw new AppError(USER_NOT_FOUND)
  else {
    const events = await Event.findAll({
      where: {
        userId: id,
        date: {
          [Op.between]: [initDate, endDate]
        }
      },
      order: [['date', 'ASC']]
    })

    const response = events.map((event) => {
      return eventMapper(event)
    })

    res.status(StatusCodes.CREATED).json({ events: response })
  }
}

const getNextEvents = async (req, res) => {
  const { id } = req.user

  const user = await User.findOne({ where: { id } })

  if (!user) throw new AppError(USER_NOT_FOUND)
  else {
    const initDate = new Date()
    const endDate = new Date()
    // Sum 7 days for the week
    endDate.setDate(endDate.getDate() + 7)

    const events = await Event.findAll({
      where: {
        userId: id,
        date: {
          [Op.between]: [initDate, endDate]
        }
      },
      order: [['date', 'ASC']]
    })

    const response = events.map((event) => {
      return eventMapper(event)
    })

    res.status(StatusCodes.CREATED).json({ events: response })
  }
}

const updateEvent = async (req, res) => {
  const { id } = req.user
  const eventId = req.params.id
  const { title, description, date, duration } = req.body

  const user = await User.findOne({ where: { id } })

  if (!user) throw new AppError(USER_NOT_FOUND)
  else {
    const event = await Event.findOne({ where: { id: eventId } })

    if (!event) throw new AppError(EVENT_NOT_FOUND)
    else {
      const updatedEvent = {
        title: title || event.title,
        description: description || event.description,
        date: date || event.date,
        duration: duration || event.duration
      }

      await event.update({ ...updatedEvent })

      res.status(StatusCodes.OK).json(eventMapper(event))
    }
  }
}

const deleteEvent = async (req, res) => {
  const { id } = req.user
  const eventId = req.params.id

  const user = await User.findOne({ where: { id } })

  if (!user) throw new AppError(USER_NOT_FOUND)
  else {
    const event = await Event.findOne({ where: { id: eventId } })

    if (!event) throw new AppError(EVENT_NOT_FOUND)
    else {
      await event.destroy()

      res.status(StatusCodes.NO_CONTENT).json({})
    }
  }
}

module.exports = {
  createEvent,
  getEvents,
  getNextEvents,
  updateEvent,
  deleteEvent
}
