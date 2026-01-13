import bcryptjs from 'bcryptjs';
import httpStatus from 'http-status-codes';
import AppError from "../../errorHelpers/AppError";
import { IUser } from "../user/user.interface"
import { User } from "../user/user.model";
import { createNewAccessTokenWithRefreshToken, createUserToken } from '../../utils/usersToken';

const credentialsLogin = async (payload: Partial<IUser>) => {
    const { email, password } = payload;
    
    const isUserExist = await User.findOne({ email })
    
    if(!isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "User does not exists")
    }
    
    const isPasswordMatched = await bcryptjs.compare(password as string, isUserExist.password as string)
    
    if(!isPasswordMatched) {
        throw new AppError(httpStatus.BAD_REQUEST, "Icorrect Password")
    }
    
    const userToken = createUserToken(isUserExist)
    
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: pass, ...rest } = isUserExist.toObject()
    
    return {
        accessToken: userToken.accessToken,
        refreshToken: userToken.refreshToken,
        user: rest
    }
}

const getNewAccessToken = async (refreshToken: string) => {
    
    const newAccessToken = await createNewAccessTokenWithRefreshToken(refreshToken)
    
    return {
        accessToken: newAccessToken.accessToken
    }
}


export const AuthService = {
    credentialsLogin,
    getNewAccessToken
}