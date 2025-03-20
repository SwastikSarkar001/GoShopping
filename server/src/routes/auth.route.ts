import { Router } from "express"
import { signIn, signOut, addUser, verifyAndGenerateAccessToken, getUserData } from "controllers/users.controller"
import { verifyFieldAndSendOtp, verifyOtp, verifySitename } from "controllers/utils.controller"
import registered from "middlewares/registered"
import { accessProtectedRoute, refreshProtectedRoute } from "middlewares/protectedRouteHandlers"

const authRoutes = Router()

authRoutes.use(registered)

authRoutes.get('/user', accessProtectedRoute, getUserData)
authRoutes.get('/check-field', verifyFieldAndSendOtp)
authRoutes.get('/check-otp', verifyOtp)
authRoutes.get('/check-sitename', verifySitename)
authRoutes.get('/refresh', refreshProtectedRoute, verifyAndGenerateAccessToken)
authRoutes.post('/signin', signIn)
authRoutes.post('/register', addUser)
authRoutes.delete('/signout', refreshProtectedRoute, signOut)

export default authRoutes