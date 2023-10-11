const log = (req, res, next) => {
  console.log('I am a middleware')
  next()
}

module.exports = log;   // export the function