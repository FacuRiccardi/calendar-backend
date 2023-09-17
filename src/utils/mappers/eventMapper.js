module.exports = (event) => {
  return {
    id: event.id,
    title: event.title,
    description: event.description,
    date: event.date,
    duration: event.duration
  }
}
