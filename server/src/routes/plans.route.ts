import { Router } from "express"
import { getFeatures, getTiers } from "../controllers/plans.controller"

const plansRoutes = Router()

plansRoutes.get('/get-features', getFeatures)
plansRoutes.get('/get-tiers', getTiers)

export default plansRoutes