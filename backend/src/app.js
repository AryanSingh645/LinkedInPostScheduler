import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

app.use(express.json({limit: "16kb"}));
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

import authorzationCodeRoute from './routes/auth.routes.js';
import userRoute from './routes/user.routes.js'
app.use('/auth/linkedin', authorzationCodeRoute)
app.use('/auth/user', userRoute)
// app.use('/auth/linkedin/callback', )

export {app}