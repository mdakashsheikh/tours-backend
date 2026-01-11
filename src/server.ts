/* eslint-disable no-console */
import { Server } from 'http';
import mongoose from 'mongoose';
import app from './app';
import { envVars } from './app/config/env';
import { seedSuperAdmin } from './app/utils/seedSuperAdmin';

let server: Server;

const startServer = async() => {
    try {
        await mongoose.connect(envVars.DB_URL)
        console.log('Connected to DB!')
        
        server = app.listen(envVars.PORT, () => {
            console.log(`Server listening on port ${envVars.PORT}`)
        })
    } catch (error) {
        console.log(error)
    }
}

(async() => {
    await startServer()
    await seedSuperAdmin()
})()

process.on('SIGTERM', () => {
    console.log('SIGTERM signal Detected!, Server shutting down...')
    
    if(server) {
        server.close()
        process.exit(1)
    }
    
    process.exit(1)
})

process.on('unhandledRejection', (err) => {
    console.log('Unhandled Rejection Detected!, Server shutting down...', err)
    
    if(server) {
        server.close()
        process.exit(1)
    }
    
    process.exit(1)
})

process.on('uncaughtException', (err) => {
    console.log('Uncaught Exception Detected!, Server shutting down...', err)
    
    if(server) {
        server.close()
        process.exit(1)
    }
    
    process.exit(1)
})

// Unhandled Rejection Error
// Promise.reject(new Error('I forgot to catch this promise!'))

// Uncaught Exception Error
// throw new Error('I forgot to handle this local!')

/**
 * unhandled rejection error
 * uncaught rejection error
 * signal termination sigterm
 */