import { Router } from "express"
import { signIn, addUser, getUsers } from "mysql"
import { User } from "types"
import registered from "middlewares/registered"

const authRoutes = Router()

authRoutes.use(registered)

authRoutes.post('/signin', async (req, res) => {
  const response = await signIn(req.body)
  res.status(response.status)
  res.send(response.result)
})

authRoutes.post('/add_user', async (req, res) => {
  const response = await addUser(req.body as User)
  res.status(response.status)
  res.send(response.message)
})

authRoutes.get('/users', async (req, res) => {
  const response = await getUsers()
  res.status(response.status)
  res.send(response.result)
})

export default authRoutes