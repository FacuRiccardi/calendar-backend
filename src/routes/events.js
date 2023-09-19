const express = require('express')
const { errorCatcher } = require('../utils/errors/errorCatcher')
const {
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
} = require('../middlewares/validator')

const router = express.Router()

// Middlewares
const auth = require('../middlewares/auth')

// Controllers
const EventController = require('../controllers/events')

router.post(
  '/api/event',
  auth,
  [validateEventTitle, validateEventDescription, validateEventDate, validateEventDuration, validate],
  errorCatcher(EventController.createEvent)
)
router.get(
  '/api/event',
  auth,
  [validateInitDate, validateEndDate, validate],
  errorCatcher(EventController.getEvents)
)
router.get('/api/event/next', auth, errorCatcher(EventController.getNextEvents))
router.patch(
  '/api/event/:id',
  auth,
  [validateEventTitleOpt, validateEventDescription, validateEventDateOpt, validateEventDurationOpt, validate],
  errorCatcher(EventController.updateEvent)
)
router.delete('/api/event/:id', auth, errorCatcher(EventController.deleteEvent))

module.exports = router
