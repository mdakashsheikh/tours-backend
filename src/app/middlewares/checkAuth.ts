import httpStatus from 'http-status-codes';
import { NextFunction, Request, Response } from "express"
import AppError from "../errorHelpers/AppError"
import { verifyToken } from "../utils/jwt"
import { envVars } from "../config/env"
import { JwtPayload } from "jsonwebtoken"
import { User } from "../modules/user/user.model"
import { IsActive } from '../modules/user/user.interface';

export const checkAuth = (...authRoles: string[]) => async(req: Request, res: Response, next: NextFunction) => {
    try {
        const accessToken = req.cookies.accessToken
        
        if(!accessToken) {
            throw new AppError(403, "No Token Recieved")
        }
        
        const verifiedToken = verifyToken(accessToken, envVars.JWT_ACCESS_SECRET) as JwtPayload
        
        const isUserExits = await User.findOne({ email: verifiedToken.email })
            
        if(!isUserExits) {
            throw new AppError(httpStatus.NOT_FOUND, "User not found")
        }
        
        if(isUserExits.isActive === IsActive.BLOCKED || isUserExits.isActive === IsActive.INACTIVE) {
            throw new AppError(httpStatus.FORBIDDEN, `User is ${isUserExits.isActive}`)
        }
        
        if(isUserExits.isDeleted) {
            throw new AppError(httpStatus.FORBIDDEN, "User is Deleted")
        }
            
        
        if(!authRoles.includes(verifiedToken.role)) {
            throw new AppError(403, "You are not permitted to view this route.")
        }
        
        req.user = verifiedToken;
        
        next()
    } catch (error) {
        next(error)
    }
}