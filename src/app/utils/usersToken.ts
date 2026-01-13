import httpStatus from 'http-status-codes';
import { envVars } from "../config/env";
import AppError from "../errorHelpers/AppError";
import { IsActive, IUser } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";
import { generateToken, verifyToken } from "./jwt";
import { JwtPayload } from 'jsonwebtoken';

export const createUserToken = (user: Partial<IUser>) => {
    const jwtPayload = {
        userId: user._id,
        email: user.email,
        role: user.role
    }
    
    const accessToken = generateToken(jwtPayload, envVars.JWT_ACCESS_SECRET, envVars.JWT_ACCESS_EXPIRES)
    
    const refreshToken = generateToken(jwtPayload, envVars.JWT_REFRESH_SECRET, envVars.JWT_REFRESH_EXPIRES)
    
    return {
        accessToken,
        refreshToken
    }
}

export const createNewAccessTokenWithRefreshToken = async(refreshToken: string) => {
    const verifiedRefreshToken = verifyToken(refreshToken, envVars.JWT_REFRESH_SECRET) as JwtPayload
    
    const isUserExits = await User.findOne({ email: verifiedRefreshToken.email })
    
    if(!isUserExits) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found")
    }
    
    if(isUserExits.isActive === IsActive.BLOCKED || isUserExits.isActive === IsActive.INACTIVE) {
        throw new AppError(httpStatus.FORBIDDEN, `User is ${isUserExits.isActive}`)
    }
    
    if(isUserExits.isDeleted) {
        throw new AppError(httpStatus.FORBIDDEN, "User is Deleted")
    }
    
    const jwtPayload = {
        userId: isUserExits._id,
        email: isUserExits.email,
        role: isUserExits.role
    }
    
    const accessToken = generateToken(jwtPayload, envVars.JWT_ACCESS_SECRET, envVars.JWT_ACCESS_EXPIRES)
    
    return {
        accessToken
    }
}