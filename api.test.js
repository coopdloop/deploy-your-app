/* eslint-env jest */
const request = require('supertest')
const localApp = require('./index')

describe('E-commerce API Tests', () => {
  let cartItemId

  test('GET / should return welcome message', async () => {
    const response = await request(localApp).get('/')
    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({ message: 'Welcome to our E-commerce API!' })
  })

  test('GET /products should return all products', async () => {
    const response = await request(localApp).get('/products')
    expect(response.statusCode).toBe(200)
    expect(Array.isArray(response.body)).toBeTruthy()
    expect(response.body.length).toBeGreaterThan(0)
  })

  test('GET /products/:id should return a specific product', async () => {
    const response = await request(localApp).get('/products/1')
    expect(response.statusCode).toBe(200)
    expect(response.body).toHaveProperty('id', 1)
    expect(response.body).toHaveProperty('name')
    expect(response.body).toHaveProperty('price')
    expect(response.body).toHaveProperty('category')
  })

  test('GET /products/:id with invalid id should return 404', async () => {
    const response = await request(localApp).get('/products/999')
    expect(response.statusCode).toBe(404)
    expect(response.body).toEqual({ message: 'Product not found' })
  })

  test('POST /cart should add a product to the cart', async () => {
    const response = await request(localApp)
      .post('/cart')
      .send({ productId: 1, quantity: 2 })
    expect(response.statusCode).toBe(200)
    expect(response.body).toHaveProperty('message', 'Product added to cart')
    expect(response.body).toHaveProperty('cart')
    expect(Array.isArray(response.body.cart)).toBeTruthy()
    expect(response.body.cart.length).toBe(1)
    cartItemId = response.body.cart[0].id
  })

  test('GET /cart should return the current cart', async () => {
    const response = await request(localApp).get('/cart')
    expect(response.statusCode).toBe(200)
    expect(Array.isArray(response.body)).toBeTruthy()
    expect(response.body.length).toBe(1)
    expect(response.body[0]).toHaveProperty('id', cartItemId)
  })

  test('POST /order should place an order and clear the cart', async () => {
    const response = await request(localApp).post('/order')
    expect(response.statusCode).toBe(200)
    expect(response.body).toHaveProperty('message', 'Order placed successfully')
    expect(response.body).toHaveProperty('order')
    expect(response.body.order).toHaveProperty('orderId')
    expect(response.body.order).toHaveProperty('items')
    expect(response.body.order).toHaveProperty('total')
    expect(response.body.order).toHaveProperty('status', 'Placed')

    // Check if cart is cleared
    const cartResponse = await request(localApp).get('/cart')
    expect(cartResponse.body).toEqual([])
  })

  test('POST /order with empty cart should return 400', async () => {
    const response = await request(localApp).post('/order')
    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual({ message: 'Cart is empty' })
  })

  test('GET /search should return matching products', async () => {
    const response = await request(localApp).get('/search?query=Electronics')
    expect(response.statusCode).toBe(200)
    expect(Array.isArray(response.body)).toBeTruthy()
    expect(response.body.length).toBeGreaterThan(0)
    expect(response.body[0]).toHaveProperty('category', 'Electronics')
  })

  test('GET /search with no results should return empty array', async () => {
    const response = await request(localApp).get('/search?query=NonexistentProduct')
    expect(response.statusCode).toBe(200)
    expect(Array.isArray(response.body)).toBeTruthy()
    expect(response.body.length).toBe(0)
  })
})
