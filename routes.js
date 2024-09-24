const express = require('express')
const router = express.Router()

// Mock data
const products = [
  { id: 1, name: 'Smartphone', price: 599.99, category: 'Electronics' },
  { id: 2, name: 'Laptop', price: 1099.99, category: 'Electronics' },
  { id: 3, name: 'Running Shoes', price: 89.99, category: 'Sports' }
]

const cart = []

// Root endpoint
router.get('/', (req, res) => {
  console.log('Root route handler called')
  res.json({ message: 'Welcome to our E-commerce API!' })
})

// Get all products
router.get('/products', (req, res) => {
  res.json(products)
})

// Get a specific product
router.get('/products/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id))
  if (product) {
    res.json(product)
  } else {
    res.status(404).json({ message: 'Product not found' })
  }
})

// Add a product to cart
router.post('/cart', (req, res) => {
  const { productId, quantity } = req.body
  const product = products.find(p => p.id === parseInt(productId))
  if (product) {
    cart.push({ ...product, quantity })
    res.json({ message: 'Product added to cart', cart })
  } else {
    res.status(404).json({ message: 'Product not found' })
  }
})

// View cart
router.get('/cart', (req, res) => {
  res.json(cart)
})

// Place an order
router.post('/order', (req, res) => {
  if (cart.length === 0) {
    res.status(400).json({ message: 'Cart is empty' })
  } else {
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const order = {
      orderId: Date.now(),
      items: cart,
      total,
      status: 'Placed'
    }
    // Clear the cart after order is placed
    cart.length = 0
    res.json({ message: 'Order placed successfully', order })
  }
})

// Search products
router.get('/search', (req, res) => {
  const { query } = req.query
  const results = products.filter(p =>
    p.name.toLowerCase().includes(query.toLowerCase()) ||
    p.category.toLowerCase().includes(query.toLowerCase())
  )
  res.json(results)
})

module.exports = router
