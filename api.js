import express from 'express'
import bodyParser from 'body-parser'
import helmet from 'helmet'
const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(helmet())

app.get('/', (req, res) => {
  res.send('Hello World!')
})

// For local Express server
export const localApp = app
