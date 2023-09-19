const faker = require('faker')
const supertest = require('supertest')

const app = require('../../src/app')
const { sequelize } = require('../../src/models')

describe('Testing Event Routes', () => {
  const title = faker.random.alphaNumeric(10)
  const description = faker.random.alphaNumeric(20)
  const date = faker.date.soon()
  const duration = 15
  const initDate = faker.date.recent()
  const endDate = faker.date.future()
  let jwt
  let otherUserJwt
  let id
  let otherEventId

  beforeAll(async () => {
    const name = faker.random.alpha(10)
    const email = `user-${name}@email.com`
    const newEmail = `user-new-${name}@email.com`
    const password = faker.random.alphaNumeric(10)

    await sequelize.authenticate()

    const user = await supertest(app)
      .post('/api/signup')
      .send({ name, email, password })
      .set('Content-Type', 'application/json')

    const otherUser = await supertest(app)
      .post('/api/signup')
      .send({ name, email: newEmail, password })
      .set('Content-Type', 'application/json')

    jwt = user.body.token
    otherUserJwt = otherUser.body.token
  })

  afterAll(async () => {
    await sequelize.close()
  })

  describe('POST: /api/event', () => {
    it('should return created Event', async () => {
      const response = await supertest(app)
        .post('/api/event')
        .set('Authorization', `Bearer ${jwt}`)
        .send({ title, description, date, duration })
        .expect(201)

      id = response.body.id

      expect(response.body.title).toMatch(title)
      expect(response.body.description).toMatch(description)
      expect(response.body.date).toMatch(date.toISOString())
      expect(response.body.duration).toBe(duration)
    })
    it('should return Validation error when no data is provided', async () => {
      const response = await supertest(app)
        .post('/api/event')
        .set('Authorization', `Bearer ${jwt}`)
        .send({})
        .expect(400)

      expect(response.body.errors.title).toBeDefined()
      expect(response.body.errors.date).toBeDefined()
      expect(response.body.errors.title).toBeDefined()
      expect(response.body.type).toMatch('Validation Error')
    })
  })

  describe('GET: /api/event', () => {
    it('should return Events in the date range', async () => {
      const response = await supertest(app)
        .get('/api/event')
        .set('Authorization', `Bearer ${jwt}`)
        .query({ initDate, endDate })
        .expect(200)

      expect(response.body.events).toBeDefined()
      expect(response.body.events[0].title).toMatch(title)
      expect(response.body.events[0].description).toMatch(description)
      expect(response.body.events[0].date).toMatch(date.toISOString())
      expect(response.body.events[0].duration).toBe(duration)
    })
    it('should return Validation error if not dates provided', async () => {
      const response = await supertest(app)
        .get('/api/event')
        .set('Authorization', `Bearer ${jwt}`)
        .query({})
        .expect(400)

      expect(response.body.errors.initDate).toBeDefined()
      expect(response.body.errors.endDate).toBeDefined()
      expect(response.body.type).toMatch('Validation Error')
    })
  })

  describe('GET: /api/event/next', () => {
    it('should return Events in the next 7 days', async () => {
      const response = await supertest(app)
        .get('/api/event/next')
        .set('Authorization', `Bearer ${jwt}`)
        .expect(200)

      expect(response.body.events).toBeDefined()
      expect(response.body.events[0].title).toMatch(title)
      expect(response.body.events[0].description).toMatch(description)
      expect(response.body.events[0].date).toMatch(date.toISOString())
      expect(response.body.events[0].duration).toBe(duration)
    })
    it('should return Not authorized if not jwt token is provided', async () => {
      const response = await supertest(app)
        .get('/api/event/next')
        .expect(401)

      expect(response.body.type).toMatch('App error')
      expect(response.body.message).toMatch('Not authorized')
    })
  })

  describe('PATCH: /api/event/:id', () => {
    const newTitle = faker.random.alphaNumeric(10)
    const newDescription = faker.random.alphaNumeric(20)
    const newDate = faker.date.soon()
    const newDuration = 30

    it('should return updated event', async () => {
      const response = await supertest(app)
        .patch(`/api/event/${id}`)
        .set('Authorization', `Bearer ${jwt}`)
        .send({ title: newTitle, description: newDescription, date: newDate, duration: newDuration })
        .expect(200)

      expect(response.body.title).toMatch(newTitle)
      expect(response.body.description).toMatch(newDescription)
      expect(response.body.date).toMatch(newDate.toISOString())
      expect(response.body.duration).toBe(newDuration)
    })
    it('should return same information if not new data is provided', async () => {
      const response = await supertest(app)
        .patch(`/api/event/${id}`)
        .set('Authorization', `Bearer ${jwt}`)
        .send({})
        .expect(200)

      expect(response.body.title).toMatch(newTitle)
      expect(response.body.description).toMatch(newDescription)
      expect(response.body.date).toMatch(newDate.toISOString())
      expect(response.body.duration).toBe(newDuration)
    })
    it('should return Not authorized if not jwt token is provided', async () => {
      const response = await supertest(app)
        .patch(`/api/event/${id}`)
        .send({})
        .expect(401)

      expect(response.body.type).toMatch('App error')
      expect(response.body.message).toMatch('Not authorized')
    })
    it('should return Not found if wrong id provided', async () => {
      const response = await supertest(app)
        .patch(`/api/event/${0}`)
        .set('Authorization', `Bearer ${jwt}`)
        .send({})
        .expect(404)

      expect(response.body.type).toMatch('App error')
      expect(response.body.message).toMatch('Event not found')
    })
    it('should return Not authorized if the User is not the Event owner', async () => {
      const newEventResponse = await supertest(app)
        .post('/api/event')
        .set('Authorization', `Bearer ${otherUserJwt}`)
        .send({ title, description, date, duration })
        .expect(201)

      otherEventId = newEventResponse.body.id

      const response = await supertest(app)
        .patch(`/api/event/${otherEventId}`)
        .set('Authorization', `Bearer ${jwt}`)
        .send({})
        .expect(401)

      expect(response.body.type).toMatch('App error')
      expect(response.body.message).toMatch('Not authorized')
    })
  })

  describe('DELETE: /api/event/:id', () => {
    it('should return Not authorized if not jwt token is provided', async () => {
      const response = await supertest(app)
        .delete(`/api/event/${id}`)
        .send({})
        .expect(401)

      expect(response.body.type).toMatch('App error')
      expect(response.body.message).toMatch('Not authorized')
    })
    it('should return Not found if wrong id provided', async () => {
      const response = await supertest(app)
        .delete(`/api/event/${0}`)
        .set('Authorization', `Bearer ${jwt}`)
        .send({})
        .expect(404)

      expect(response.body.type).toMatch('App error')
      expect(response.body.message).toMatch('Event not found')
    })
    it('should return Not authorized if the User is not the Event owner', async () => {
      const response = await supertest(app)
        .delete(`/api/event/${otherEventId}`)
        .set('Authorization', `Bearer ${jwt}`)
        .send({})
        .expect(401)

      expect(response.body.type).toMatch('App error')
      expect(response.body.message).toMatch('Not authorized')
    })
    it('should return No content and delete the event', async () => {
      const response = await supertest(app)
        .delete(`/api/event/${id}`)
        .set('Authorization', `Bearer ${jwt}`)
        .send({})
        .expect(204)

      expect(response.body).toEqual({})

      const eventResponse = await supertest(app)
        .delete(`/api/event/${id}`)
        .set('Authorization', `Bearer ${jwt}`)
        .send({})
        .expect(404)

      expect(eventResponse.body.type).toMatch('App error')
      expect(eventResponse.body.message).toMatch('Event not found')
    })
  })
})
