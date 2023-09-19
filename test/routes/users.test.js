const faker = require('faker')
const supertest = require('supertest')

const app = require('../../src/app')
const { sequelize } = require('../../src/models')

describe('Testing Users Routes', () => {
  const name = faker.random.alpha(10)
  const email = `user-${name}@email.com`
  const password = faker.random.alphaNumeric(10)
  let jwt

  beforeAll(async () => {
    await sequelize.authenticate()
  })

  afterAll(async () => {
    await sequelize.close()
  })

  describe('POST: /api/signup', () => {
    it('should return created User', async () => {
      const response = await supertest(app)
        .post('/api/signup')
        .send({ name, email, password })
        .set('Content-Type', 'application/json')
        .expect(201)

      jwt = response.body.token

      expect(response.body.name).toMatch(name)
      expect(response.body.email).toMatch(email)
      expect(response.body.token).toBeDefined()
    })
    it('should return Validation error when no data is provided', async () => {
      const response = await supertest(app)
        .post('/api/signup')
        .send({})
        .set('Content-Type', 'application/json')
        .expect(400)

      expect(response.body.errors.name).toBeDefined()
      expect(response.body.errors.email).toBeDefined()
      expect(response.body.errors.password).toBeDefined()
      expect(response.body.type).toMatch('Validation Error')
    })
  })

  describe('POST: /api/signin', () => {
    it('should return Unique constraint error when trying to create a user with an already used email', async () => {
      const response = await supertest(app)
        .post('/api/signup')
        .send({ name, email, password })
        .set('Content-Type', 'application/json')
        .expect(400)

      expect(response.body.errors.email).toBeDefined()
      expect(response.body.type).toMatch('Unique Constraint Error')
    })
    it('should return JWT token', async () => {
      const response = await supertest(app)
        .post('/api/signin')
        .send({ email, password })
        .set('Content-Type', 'application/json')
        .expect(200)

      expect(response.body.name).toMatch(name)
      expect(response.body.email).toMatch(email)
      expect(response.body.token).toBeDefined()
    })
    it('should return Validation error when no data is provided', async () => {
      const response = await supertest(app)
        .post('/api/signin')
        .send({})
        .set('Content-Type', 'application/json')
        .expect(400)

      expect(response.body.errors.email).toBeDefined()
      expect(response.body.errors.password).toBeDefined()
      expect(response.body.type).toMatch('Validation Error')
    })
    it('should return Not found when invalid user is provided', async () => {
      const response = await supertest(app)
        .post('/api/signin')
        .send({ email: `user-${faker.random.alpha()}@email.com`, password: faker.random.alphaNumeric(10) })
        .set('Content-Type', 'application/json')
        .expect(404)

      expect(response.body.type).toMatch('App error')
      expect(response.body.message).toMatch('User not found')
    })
    it('should return Wrong password when invalid password is provided', async () => {
      const response = await supertest(app)
        .post('/api/signin')
        .send({ email, password: faker.random.alphaNumeric(10) })
        .set('Content-Type', 'application/json')
        .expect(400)

      expect(response.body.type).toMatch('App error')
      expect(response.body.message).toMatch('Wrong password')
    })
  })

  describe('GET: /api/user', () => {
    it('should return user info', async () => {
      const response = await supertest(app)
        .get('/api/user')
        .set('Authorization', `Bearer ${jwt}`)
        .expect(200)

      expect(response.body.name).toMatch(name)
      expect(response.body.email).toMatch(email)
    })
    it('should return Not Authorized when no token is provided', async () => {
      const response = await supertest(app)
        .get('/api/user')
        .expect(401)

      expect(response.body.type).toMatch('App error')
      expect(response.body.message).toMatch('Not authorized')
    })
    it('should return Token validation error when invalid token is provided', async () => {
      const response = await supertest(app)
        .get('/api/user')
        .set('Authorization', `Bearer ${faker.random.alpha(15)}`)
        .expect(500)

      expect(response.body.type).toMatch('App error')
      expect(response.body.message).toMatch('Something went wrong with the token validation')
    })
  })

  describe('PATCH: /api/user', () => {
    it('should return updated user', async () => {
      const newName = faker.random.alpha(10)
      const newPassword = faker.random.alphaNumeric(10)

      const response = await supertest(app)
        .patch('/api/user')
        .set('Authorization', `Bearer ${jwt}`)
        .send({ name: newName, password: newPassword })
        .set('Content-Type', 'application/json')
        .expect(200)

      expect(response.body.name).toMatch(newName)
      expect(response.body.email).toMatch(email)
    })
    it('should return user info if not updated data is provided', async () => {
      const response = await supertest(app)
        .patch('/api/user')
        .set('Authorization', `Bearer ${jwt}`)
        .send({})
        .set('Content-Type', 'application/json')
        .expect(200)

      expect(response.body.name).toBeDefined()
      expect(response.body.email).toBeDefined()
    })
    it('should return Validation error when invalid data is provided', async () => {
      const newName = ''
      const newPassword = faker.random.alphaNumeric(100)

      const response = await supertest(app)
        .patch('/api/user')
        .set('Authorization', `Bearer ${jwt}`)
        .send({ name: newName, password: newPassword })
        .set('Content-Type', 'application/json')
        .expect(400)

      expect(response.body.errors.name).toBeDefined()
      expect(response.body.errors.password).toBeDefined()
    })
    it('should return Not Authorized when no token is provided', async () => {
      const newName = faker.random.alpha(10)
      const newPassword = faker.random.alphaNumeric(10)

      const response = await supertest(app)
        .patch('/api/user')
        .send({ name: newName, password: newPassword })
        .set('Content-Type', 'application/json')
        .expect(401)

      expect(response.body.type).toMatch('App error')
      expect(response.body.message).toMatch('Not authorized')
    })
  })

  describe('DELETE: /api/user', () => {
    it('should return Not Authorized when no token is provided', async () => {
      const response = await supertest(app)
        .delete('/api/user')
        .expect(401)

      expect(response.body.type).toMatch('App error')
      expect(response.body.message).toMatch('Not authorized')
    })
    it('should return No content and delete user', async () => {
      const response = await supertest(app)
        .delete('/api/user')
        .set('Authorization', `Bearer ${jwt}`)
        .expect(204)

      expect(response.body).toEqual({})

      const userResponse = await supertest(app)
        .get('/api/user')
        .set('Authorization', `Bearer ${jwt}`)
        .expect(404)

      expect(userResponse.body.type).toMatch('App error')
      expect(userResponse.body.message).toMatch('User not found')
    })
  })
})
