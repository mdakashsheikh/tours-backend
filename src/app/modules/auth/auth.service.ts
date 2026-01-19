/* eslint-disable @typescript-eslint/no-non-null-assertion */
import bcryptjs from 'bcryptjs';
import httpStatus from 'http-status-codes';
import AppError from "../../errorHelpers/AppError";
import { User } from "../user/user.model";
import { createNewAccessTokenWithRefreshToken } from '../../utils/usersToken';
import { JwtPayload } from 'jsonwebtoken';
import { envVars } from '../../config/env';

// const credentialsLogin = async (payload: Partial<IUser>) => {
//     const { email, password } = payload;
    
//     const isUserExist = await User.findOne({ email })
    
//     if(!isUserExist) {
//         throw new AppError(httpStatus.BAD_REQUEST, "User does not exists")
//     }
    
//     const isPasswordMatched = await bcryptjs.compare(password as string, isUserExist.password as string)
    
//     if(!isPasswordMatched) {
//         throw new AppError(httpStatus.BAD_REQUEST, "Icorrect Password")
//     }
    
//     const userToken = createUserToken(isUserExist)
    
//     // eslint-disable-next-line @typescript-eslint/no-unused-vars
//     const { password: pass, ...rest } = isUserExist.toObject()
    
//     return {
//         accessToken: userToken.accessToken,
//         refreshToken: userToken.refreshToken,
//         user: rest
//     }
// }

const getNewAccessToken = async (refreshToken: string) => {
    
    const newAccessToken = await createNewAccessTokenWithRefreshToken(refreshToken)
    
    return {
        accessToken: newAccessToken.accessToken
    }
}

const resetPassword = async(oldPassword: string, newPassword: string, decodedToken: JwtPayload) => {
    
    const user = await User.findById(decodedToken.userId)

    const isOldPasswordMatch = await bcryptjs.compare(oldPassword, user!.password as string)
    
    if(!isOldPasswordMatch) {
        throw new AppError(httpStatus.UNAUTHORIZED, "Old Password does not match!")
    }
    
    user!.password = await bcryptjs.hash(newPassword, Number(envVars.BCRYPT_SALT_ROUND))
    
    user!.save();
}

export const AuthService = {
    // credentialsLogin,
    getNewAccessToken,
    resetPassword
}