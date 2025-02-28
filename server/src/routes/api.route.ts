import { Router } from "express"
import authRoutes from "./auth.route"
import plansRoutes from "./plans.route"
import { health } from "controllers/api.controller"

const apiRoutes = Router()

apiRoutes.use('/auth', authRoutes)
apiRoutes.use('/plans', plansRoutes)
apiRoutes.get('/health', health)

export default apiRoutes