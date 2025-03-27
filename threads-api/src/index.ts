/**
 * 🐱 Author: HaYen <hanguyentieuyen@gmail.com>
 * 🍀 Made with ❤️ and ☕ by hanguyentieuyen
 * 🏠 [Repo](https://github.com/hanguyentieuyen/threads-replica)
 */

import express from 'express'
import databaseService from './services/database.services'
import usersRouter from './routes/users.routes'
import { defaultErrorHandler } from './utils/error.middlewares'
import cors, { CorsOptions } from 'cors'
import postsRouter from './routes/posts.routes'
import searchRouter from './routes/search.routes'
import mediaRouter from './routes/medias.routes'
import hashTagsRouter from './routes/hashtags.routes'
import { createUploadFolder } from './utils/fileparser'
import staticRouter from './routes/static.routes'
//import '~/utils/fake-data'
import swaggerUi from 'swagger-ui-express'
import swaggerJSDoc from 'swagger-jsdoc'
import commentsRouter from './routes/comments.routes'
import { envConfig } from './utils/config'
import notificationsRouter from './routes/notifications.routes'
import { createServer } from 'http'
import initializeSocket from './utils/socket'

const app = express()

app.use(express.json()) // middleware: convert json to object
app.get('/', (req, res) => {
  res.send(`<html>
      <head>
        <title>Threads Replica API</title>
        <style>
          body { font-family: Arial, sans-serif; text-align: center; margin-top: 50px; }
          h1 { color: #ff4d4d; }
        </style>
      </head>
      <body>
        <h1>😸 Welcome to Threads Replica API</h1>
        <p>👉 <a href='https://threads-replica-5n8l.onrender.com/api-docs'>Click here</a> to read the apis documentation</p>
        <p>Make with ❤️ by <strong><a href='https://github.com/hanguyentieuyen'>hanguyentieuyen</a></strong></p>
      </body>
    </html>`)
})

// swagger api
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Threads Replica APIs',
      version: '1.0.0'
    }
  },
  apis: ['./swagger/*.yaml']
}

const openapiSpeciation = swaggerJSDoc(options)

// cors
const corsOption: CorsOptions = {
  origin: '*'
}

// Create upload files folder
createUploadFolder()

const server = createServer(app)

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiSpeciation))

app.use(cors(corsOption))
// route endpoint
app.use('/users', usersRouter)
app.use('/posts', postsRouter)
app.use('/search', searchRouter)
app.use('/medias', mediaRouter)
app.use('/static', staticRouter)
app.use('/hashtags', hashTagsRouter)
app.use('/comments', commentsRouter)
app.use('/notifications', notificationsRouter)

// Database connection and indexing
databaseService.connect().then(() => {
  databaseService.indexPosts() // Make sure this function exists and is correct.
})

// Error handler middleware
app.use(defaultErrorHandler)

initializeSocket(server)
// Start the server
server.listen(envConfig.port, () => {
  console.log(`Server is running at port ${envConfig.port}`)
})
