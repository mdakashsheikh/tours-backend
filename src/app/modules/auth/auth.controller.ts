/* eslint-disable @typescript-eslint/no-unused-vars */
import httpStatus from 'http-status-codes';
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AuthService } from './auth.service';
import AppError from '../../errorHelpers/AppError';
import { setAuthCookie } from '../../utils/setCookie';

const credentialsLogin = catchAsync(async(req: Request, res: Response, next: NextFunction) => {
    const loginInfo = await AuthService.credentialsLogin(req.body)
    
    // res.cookie("accessToken", loginInfo.accessToken, {
    //     httpOnly: true,
    //     secure: false
    // })
    
    setAuthCookie(res, loginInfo)
    
    // res.cookie("refreshToken", loginInfo.refreshToken, {
    //     httpOnly: true,
    //     secure: false
    // })
    
    setAuthCookie(res, loginInfo)
    
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User Loged In Successfully!",
        data: loginInfo     
    })
})

const getNewAccessToken = catchAsync(async(req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;
    
    if(!refreshToken) {
        throw new AppError(httpStatus.BAD_REQUEST, "No refresh token received from cookies")
    }
    
    const tokenInfo = await AuthService.getNewAccessToken(refreshToken as string)
    
    // res.cookie("accessToken", tokenInfo.accessToken, {
    //     httpOnly: true,
    //     secure: false
    // }) 
    
    setAuthCookie(res, tokenInfo)
    
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Get New Access Token Retrived Successfully",
        data: tokenInfo
    })
})

const logout = catchAsync(async(req: Request, res: Response, next: NextFunction) => {
    
    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: false,
        sameSite: "lax"
    })
    
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: false,
        sameSite: "lax"
    })
    
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Logged Out Successfully!",
        data: null
    })
})

const resetPassword = catchAsync(async(req:Request, res: Response, next: NextFunction) => {
    
    const newPassword = req.body.newPassword;
    const oldPassword = req.body.oldPassword;
    
    const decodedToken = req.user;
    
    await AuthService.resetPassword(oldPassword, newPassword, decodedToken)
    
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Password changed successfully!",
        data: null
    })
})

export const AuthControllers = {
    credentialsLogin,
    getNewAccessToken,
    logout,
    resetPassword
}