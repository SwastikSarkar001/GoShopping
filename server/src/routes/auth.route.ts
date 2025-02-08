import { Router } from "express"
import { signIn, signOut, addUser, deleteUser, verifyAndGenerateAccessToken } from "controllers/users.controller"
import { verifyAndSendOtp, verifyOtp } from "controllers/utils.controller"
import registered from "middlewares/registered"
import { accessProtectedRoute, refreshProtectedRoute } from "middlewares/protectedRouteHandlers"

const authRoutes = Router()

authRoutes.use(registered)

// authRoutes.post('/signin', asyncHandler(async (req, res) => {
//   const response = await signIn(req.body)
//   res.status(response.status)
//   res.send(response.result)
// }))

authRoutes.get('/check-field', verifyAndSendOtp)
authRoutes.get('/check-otp', verifyOtp)
authRoutes.post('/signin', signIn)
authRoutes.delete('/signout', accessProtectedRoute, signOut)
authRoutes.post('/register', addUser)
authRoutes.delete('/remove', deleteUser)
authRoutes.get('/refresh', refreshProtectedRoute, verifyAndGenerateAccessToken)

// authRoutes.get('/users', asyncHandler(async (req, res) => {
//   const response = await getUsers()
//   res.status(response.status)
//   res.send(response.result)
// }))

export default authRoutes