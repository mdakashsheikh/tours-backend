import z from "zod";
import { IsActive, Role } from "./user.interface";

 export const createUserZodSchema = z.object({
    name: z
        .string()
        .min(2, { message: "Name too short " })
        .max(50, { message: "Name too long"})
        .refine(val => typeof val === "string", {
            message: "Name must be a string"
        }),
    email: z.string().email(),
    password: z
        .string()
        .min(8)
        .regex(/^(?=.*[A-Z])/, {
            message: "Password must contain at least 1 uppercase letter."
        })
        .regex(/^(?=.*[!@#$%^&*])/, {
            message: "Password must contain at least 1 special character."
        })
        .regex(/^(?=.*\d)/, {
            message: "Password must contain at least 1 number."
        }),
    phone: z
        .string()
        .regex(/^(?:\+8801\d{9}|01\d{9})$/, {
            message: "Phone number must be valid for Bangladesh. Format: +8801XXXXXXXXX or 01XXXXXXXXX"
        }).
        refine(val => typeof val === "string", {
            message: "Phone must be string"
        })
        .optional(),
    address: z
        .string()
        .max(200, { message: "Address cannot exceed 200 character." })
        .refine(val => typeof val === "string", {
            message: "Address must be string."
        })
        .optional(),
})


export const updateUserZodSchema = z.object({
    name: z
        .string()
        .min(2, { message: "Name too short " })
        .max(50, { message: "Name too long"})
        .refine(val => typeof val === "string", {
            message: "Name must be a string"
        }).optional(),
    password: z
        .string()
        .min(8)
        .regex(/^(?=.*[A-Z])/, {
            message: "Password must contain at least 1 uppercase letter."
        })
        .regex(/^(?=.*[!@#$%^&*])/, {
            message: "Password must contain at least 1 special character."
        })
        .regex(/^(?=.*\d)/, {
            message: "Password must contain at least 1 number."
        }),
    phone: z
        .string()
        .regex(/^(?:\+8801\d{9}|01\d{9})$/, {
            message: "Phone number must be valid for Bangladesh. Format: +8801XXXXXXXXX or 01XXXXXXXXX"
        }).
        refine(val => typeof val === "string", {
            message: "Phone must be string"
        })
        .optional(),
    address: z
        .string()
        .max(200, { message: "Address cannot exceed 200 character." })
        .refine(val => typeof val === "string", {
            message: "Address must be string."
        })
        .optional(),
    role: z
        .enum(Object.values(Role) as [string])
        .optional(),
    IsActive: z
        .enum(Object.values(IsActive) as [string])
        .optional(),
    isDeleted: z
        .boolean()
        .refine(val => typeof val === "boolean", {
            message: "isDeleted must be true or false"
        })
        .optional(),
    isVarfied: z
        .boolean()
        .refine(val => typeof val === "boolean", {
            message: "isVarfied must be true or false"
        })
        .optional(),
})