import { Request, Response } from "express";
import { UserService } from "./user.service";

const createUser = async(req: Request, res: Response) => {
    try {
        const user = await UserService.createUser(req.body)
        res.status(201).json({
            message: "User Created Successfuly!",
            user
        })
    } catch (error) {
        res.status(400).json({
            message: `Something went wrong!! ${error} `,
            error
        })
    }
}

export const UserControllers = {
    createUser
}