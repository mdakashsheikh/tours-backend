import { NextFunction, Request, Response, Router } from "express";
import { UserControllers } from "./user.controller";
import { createUserZodSchema } from "./user.validation";
import { validateRequest } from "../../middlewares/validateRequest";
import AppError from "../../errorHelpers/AppError";
import jwt from "jsonwebtoken";



const router = Router()

router.post("/register", validateRequest(createUserZodSchema), UserControllers.createUser)
router.get("/all-users", async(req: Request, res: Response, next: NextFunction) => {
    try {
        const accessToken = req.headers.authorization
        
        if(!accessToken) {
            throw new AppError(403, "No Token Recieved")
        }
        
        const verifiedToken = await jwt.verify(accessToken, "secret")
        
        next()
    } catch (error) {
        next(error)
    }
} , UserControllers.getAllUsers)

export const UserRoutes = router