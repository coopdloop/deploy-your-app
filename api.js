import express from 'express'
const app = express()

app.get('/', (req, res) => {
  res.send('Hello World!')
})

// AWS Lambda handler
export const handler = async (event, context) => {
  const { httpMethod, path, headers, body } = event

  return new Promise((resolve, reject) => {
    // Create a mock request object
    const req = {
      method: httpMethod,
      url: path,
      headers,
      body: body ? JSON.parse(body) : {}
    }

    // Create a mock response object
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
        return this
      },
      send (data) {
        this.body = data
        return this
      },
      setHeader (key, value) {
        this.headers[key] = value
        return this
      }
    }

    app(req, res, () => {
      // If we get here, no route handled the request, so resolve with a 404
      resolve({ statusCode: 404, body: 'Not Found' })
    })
  })
}

// For local Express server
export const localApp = app
