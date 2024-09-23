const express = require('express')
const bodyParser = require('body-parser')
const helmet = require('helmet')

const app = express()

// Apply middleware conditionally
if (!process.env.AWS_LAMBDA_FUNCTION_NAME) {
  // We're not in Lambda, apply all middleware
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(helmet())
} else {
  // We're in Lambda, skip helmet
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))
}

app.use((req, res, next) => {
  console.log(`Received request: ${req.method} ${req.url}`)
  next()
})

app.get('/', (req, res) => {
  console.log('Root route handler called')
  res.send('Hello World!')
})

// AWS Lambda handler
const handler = async (event, context) => {
  console.log('Received event:', JSON.stringify(event, null, 2))

  return new Promise((resolve, reject) => {
    const req = {
      method: (event.httpMethod || 'GET').toUpperCase(),
      url: event.path || '/',
      headers: event.headers || {},
      body: event.body ? JSON.parse(event.body) : {},
      query: event.queryStringParameters || {}
    }

    console.log('Created req object:', JSON.stringify(req, null, 2))

    const res = {
      statusCode: 200,
      headers: {},
      body: '',
      status (statusCode) {
        this.statusCode = statusCode
        return this
      },
      json (data) {
        this.headers['Content-Type'] = 'application/json'
        this.body = JSON.stringify(data)
        resolve({
          statusCode: this.statusCode,
          headers: this.headers,
          body: this.body
        })
      },
      send (data) {
        this.body = typeof data === 'string' ? data : JSON.stringify(data)
        resolve({
          statusCode: this.statusCode,
          headers: this.headers,
          body: this.body
        })
      },
      setHeader (key, value) {
        this.headers[key] = value
        return this
      }
    }

    app(req, res, (err) => {
      if (err) {
        console.error('Error in Express app:', err)
        resolve({ statusCode: 500, body: 'Internal Server Error' })
      } else {
        console.log('No route handled the request, sending 404')
        resolve({ statusCode: 404, body: 'Not Found' })
      }
    })
  })
}

// Determine if we're running in Lambda or locally
if (process.env.AWS_LAMBDA_FUNCTION_NAME) {
  // We're in Lambda, export the handler
  module.exports = { handler }
} else {
  // We're running locally, export the Express app
  module.exports = app
}

// Export handler for local container invocation
module.exports.handler = handler
