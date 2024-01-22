import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express()

// using this to allow access to our backend from specific URLs
app.use(
  cors({
    origin: process.env.CORS_ORIGINS,
    credentials: true,
  })
)
// earlier we use body-parser https://www.npmjs.com/package/body-parser
// so that our app can parse json and setting limit to 16kb
app.use(
  express.json({
    limit: '16kb',
  })
)

// to handle the data in URL encoded format (e.g. changing a=b&c=d to {a: 'b', c: 'd'})
app.use(express.urlencoded({ extended: true, limit: '16kb' }))

// to handle static files
app.use(express.static('public'))

// to handle cookies
app.use(cookieParser())
export { app }
