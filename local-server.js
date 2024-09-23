import { localApp } from './api.js'

const PORT = process.env.PORT || 3000

localApp.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
