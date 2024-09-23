/* eslint-env jest */
import request from 'supertest'
import { localApp } from './api.js'

describe('Express App Tests', () => {
  test('GET / should return Hello World', async () => {
    const response = await request(localApp).get('/')
    expect(response.statusCode).toBe(200)
    expect(response.text).toBe('Hello World!')
  })
})
