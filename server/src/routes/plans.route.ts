import { Router } from "express"
import { getFeatures, getTiers, getUserPlans, purchasePlan } from "../controllers/plans.controller"
import { accessProtectedRoute } from "middlewares/protectedRouteHandlers"

const plansRoutes = Router()

plansRoutes.get('/get-features', getFeatures)
plansRoutes.get('/get-tiers', getTiers)
plansRoutes.post('/purchase', accessProtectedRoute, purchasePlan)
plansRoutes.get('/get-user-plans', accessProtectedRoute, getUserPlans)

export default plansRoutes