import { Router } from "express";
import validate from "../../../../shared/presentation/http/middlewares/validate-request.js";
import { authMiddleware } from "../../../../shared/presentation/http/middlewares/auth.middleware.js";
import { userController } from "../../container/container.js";


const router = Router();

router.get("/get-users",authMiddleware,userController.getCustomers)



export default router;