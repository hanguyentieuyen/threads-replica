import express from 'express'
import databaseService from './services/database.services'
import usersRouter from './routes/users.routes'
import { defaultErrorHandler } from './utils/error.middlewares'

const app = express()
const port = 3000

app.use(express.json()) // middleware: convert json to object
app.get('/', (req, res) => {
  res.send('hello yen')
})
app.use('/users', usersRouter)
databaseService.connect()

app.use(defaultErrorHandler)
app.listen(port, () => {
  console.log(`Server is running at port ${port}`)
})
