import express from 'express'
import databaseService from './services/database.services'
import usersRouter from './routes/users.routes'
import { defaultErrorHandler } from './utils/error.middlewares'
import cors, { CorsOptions } from 'cors'
import postsRouter from './routes/posts.routes'
import bookmarkRouter from './routes/bookmarks.routes'
import likeRouter from './routes/likes.routes'
import searchRouter from './routes/search.routes'
const app = express()
const port = 4000

app.use(express.json()) // middleware: convert json to object
app.get('/', (req, res) => {
  res.send('hello yen')
})
// cors
const corsOption: CorsOptions = {
  origin: '*'
}

app.use(cors(corsOption))

// route endpoint
app.use('/users', usersRouter)
app.use('/posts', postsRouter)
app.use('/bookmarks', bookmarkRouter)
app.use('/likes', likeRouter)
app.use('/search', searchRouter)

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
