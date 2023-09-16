class AppError extends Error {
  constructor (error) {
    super(error.name)
    this.statusCode = error.code
    this.message = error.message
  }
}

module.exports = AppError
