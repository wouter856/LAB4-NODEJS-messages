const express = require('express')
const app = express()
const port = 3000

// require logger.js (is middleware: doet stappen tussen je request en response)
//const logger = require('./middleware/logger.js')

//require the routes
const messagesRouter = require('./routes/api/v1/messages.js');

//json body parser
app.use(express.json());
app.use("/api/v1/messages", messagesRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})