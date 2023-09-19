const { StatusCodes } = require('http-status-codes')
const { Op } = require('sequelize')

const { Event } = require('../models/index')
const AppError = require('../utils/errors/AppError')
const { EVENT_NOT_FOUND, NOT_AUTHORIZED } = require('../utils/constants/appErrors')
const eventMapper = require('../utils/mappers/eventMapper')

const createEvent = async (req, res) => {
  const user = req.user
  const { title, description, date, duration } = req.body

  const event = await Event.create({
    title,
    description,
    date,
    duration,
    userId: user.id
  })

  res.status(StatusCodes.CREATED).json(eventMapper(event))
}

const getEvents = async (req, res) => {
  const { id } = req.user
  const { initDate, endDate } = req.query

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

  res.status(StatusCodes.OK).json({ events: response })
}

const getNextEvents = async (req, res) => {
  const { id } = req.user

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

  res.status(StatusCodes.OK).json({ events: response })
}

const updateEvent = async (req, res) => {
  const { id } = req.user
  const eventId = req.params.id
  const { title, description, date, duration } = req.body

  const event = await Event.findOne({ where: { id: eventId } })

  if (!event) throw new AppError(EVENT_NOT_FOUND)
  else if (event.userId !== id) throw new AppError(NOT_AUTHORIZED)
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

const deleteEvent = async (req, res) => {
  const { id } = req.user
  const eventId = req.params.id

  const event = await Event.findOne({ where: { id: eventId } })

  if (!event) throw new AppError(EVENT_NOT_FOUND)
  else if (event.userId !== id) throw new AppError(NOT_AUTHORIZED)
  else {
    await event.destroy()

    res.status(StatusCodes.NO_CONTENT).json({})
  }
}

module.exports = {
  createEvent,
  getEvents,
  getNextEvents,
  updateEvent,
  deleteEvent
}
