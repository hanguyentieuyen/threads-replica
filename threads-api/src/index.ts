import express from 'express'
import databaseService from './services/database.services'
import usersRouter from './routes/users.routes'
import { defaultErrorHandler } from './utils/error.middlewares'
import cors, { CorsOptions } from 'cors'
import postsRouter from './routes/posts.routes'
import bookmarkRouter from './routes/bookmarks.routes'
import likeRouter from './routes/likes.routes'
import searchRouter from './routes/search.routes'
import mediaRouter from './routes/medias.routes'
import { createUploadFolder } from './utils/fileparser'
import staticRouter from './routes/static.routes'
//import '~/utils/fake-data'
import swaggerUi from 'swagger-ui-express'
import swaggerJSDoc from 'swagger-jsdoc'

const app = express()
const port = 4000

app.use(express.json()) // middleware: convert json to object
app.get('/', (req, res) => {
  res.send('hello yen')
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

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiSpeciation))

app.use(cors(corsOption))
// route endpoint
app.use('/users', usersRouter)
app.use('/posts', postsRouter)
app.use('/bookmark', bookmarkRouter)
app.use('/like', likeRouter)
app.use('/search', searchRouter)
app.use('/medias', mediaRouter)
app.use('/static', staticRouter)

// Database connection and indexing
databaseService.connect().then(() => {
  databaseService.indexPosts() // Make sure this function exists and is correct.
})

// Error handler middleware
app.use(defaultErrorHandler)

// Start the server
app.listen(port, () => {
  console.log(`Server is running at port ${port}`)
})
