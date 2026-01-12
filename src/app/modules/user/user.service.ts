import httpStatus from 'http-status-codes';
import AppError from "../../errorHelpers/AppError";
import { IAuthProvider, IUser, Role } from "./user.interface";
import { User } from "./user.model";
import bcryptjs from "bcryptjs";
import { envVars } from '../../config/env';
import { JwtPayload } from 'jsonwebtoken';

const createUser = async(payload: Partial<IUser>) => {
    const { email, password, ...rest } = payload;
    
    const isUserExist = await User.findOne({ email })
    
    if(isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "User Already Exists")
    }
    
    const hashedPassword = await bcryptjs.hash(password as string, Number(envVars.BCRYPT_SALT_ROUND))
    
    
    const authProvider: IAuthProvider = { provider: "credentials", providerId: email as string }
    const user = await User.create({
        email,
        password: hashedPassword,
        auths: [authProvider],
        ...rest
    })
    
    return user
}

const updateUser = async(userId: string, payload: Partial<IUser>, decodedToken: JwtPayload) => {
    const user = await User.findById(userId);
    
    if(!user) {
        throw new AppError(httpStatus.NOT_FOUND, "User Not Found")
    }

    if(payload.role){
        if(decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE){
            throw new AppError(httpStatus.FORBIDDEN, "You don't have permission to change role")
        }  
    }

    const { email, ...rest } = payload; 
    
    const updatedUser = await User.findByIdAndUpdate(userId, rest, { new: true });
    
    return updatedUser;
}

const getAllUsers = async() => {
    const users = await User.find({});
    
    const totalUsers = await User.countDocuments()
    
    return {
        data: users,
        meta: {
            total: totalUsers
        }
    }
}

export const UserService = {
    createUser,
    getAllUsers,
}