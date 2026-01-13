import cookieParser from "cookie-parser";
import cors from "cors"
import express, { Request, Response } from 'express';
import { router } from './app/routes';
import { golobalErrorHandler } from './app/middlewares/globalErrorHandler';
import notFound from "./app/middlewares/notFound";

const app = express()

app.use(cookieParser())
app.use(express.json())
app.use(cors())

app.use("/api/v1", router)

app.get('/', (req: Request, res: Response) => {
    res.send("Wlecome to Tour Management System Backend")
})

app.use(notFound)

app.use(golobalErrorHandler)

export default app