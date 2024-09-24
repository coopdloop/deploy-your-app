/* eslint-env jest */
const request = require('supertest')
const localApp = require('./index')

describe('Express App Tests', () => {
  test('GET / should return Hello World', async () => {
    const response = await request(localApp).get('/')
    expect(response.statusCode).toBe(200)
    expect(JSON.parse(response.text)).toStrictEqual({ response: 'Hello World!' })
  })
})
