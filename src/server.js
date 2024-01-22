import 'dotenv/config'
import connectDB from './db/index.js'
import { app } from './app.js'

connectDB().then(() => {
  app.on('error', (error) => {
    console.log(error)
    throw error
  })
  app.listen(process.env.PORT || 8000, () => {
    console.log(`listening on port ${process.env.PORT || 8000}`)
  })
})
