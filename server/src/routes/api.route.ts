import { Router } from "express"
import { signIn, addUser, getUsers } from "mysql"
import { User } from "types"

const apiRoutes = Router()

apiRoutes.post('/signin', async (req, res) => {
  const response = await signIn(req.body)
  res.status(response.status)
  res.send(response.result)
})

apiRoutes.post('/add_user', async (req, res) => {
  const response = await addUser(req.body as User)
  res.status(response.status)
  res.send(response.message)
})

apiRoutes.get('/users', async (req, res) => {
  const response = await getUsers()
  res.status(response.status)
  res.send(response.result)
})

export default apiRoutes