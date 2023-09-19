class ValidationError extends Error {
  constructor (error) {
    super(error.name)
    this.statusCode = error.code
    this.message = error.message
    this.errors = error.errors
  }
}

module.exports = ValidationError
