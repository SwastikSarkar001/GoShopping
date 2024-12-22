import { Router } from "express"
import { signIn, addUser, getUsers } from "controllers/users.controller"
import { User } from "types"
import registered from "middlewares/registered"

const authRoutes = Router()

authRoutes.use(registered)

// authRoutes.post('/signin', asyncHandler(async (req, res) => {
//   const response = await signIn(req.body)
//   res.status(response.status)
//   res.send(response.result)
// }))

authRoutes.post('/register', addUser)

// authRoutes.get('/users', asyncHandler(async (req, res) => {
//   const response = await getUsers()
//   res.status(response.status)
//   res.send(response.result)
// }))

export default authRoutes