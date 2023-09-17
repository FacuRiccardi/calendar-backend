const express = require('express')
const { errorCatcher } = require('../utils/errors/errorCatcher')

const router = express.Router()

// Middlewares
const auth = require('../middlewares/auth')

// Controllers
const EventController = require('../controllers/events')

router.post('/api/event', auth, errorCatcher(EventController.createEvent))
router.get('/api/event', auth, errorCatcher(EventController.getEvents))
router.get('/api/event/next', auth, errorCatcher(EventController.getNextEvents))
router.patch('/api/event/:id', auth, errorCatcher(EventController.updateEvent))
router.delete('/api/event/:id', auth, errorCatcher(EventController.deleteEvent))

module.exports = router
