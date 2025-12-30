import express, { Request, Response } from 'express';

const app = express()

app.get('/', (req: Request, res: Response) => {
    res.send("Wlecome to Tour Management System Backend")
    
})

export default app