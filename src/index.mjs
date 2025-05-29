import express from 'express'
import session from 'express-session'
import passport from 'passport'
import cors from 'cors'
import pgPromise from 'pg-promise'

import dotenv from 'dotenv'
dotenv.config({ path: './.env'});

import authRouter from './routes/auth.mjs'
import tasksRouter from './routes/tasks.mjs'
import { GetUserFromUsername } from './utils/userQueries.mjs'

const app = express();
const pgp = pgPromise();

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

app.use(express.json())

app.use(session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: 60000 * 60 * 24,
    },
}));

app.use(passport.initialize());
app.use(passport.session())

app.use('/auth/', authRouter);
app.use('/tasks/', tasksRouter);

const dbConnection = {
    host: process.env.DB_HOSTNAME,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    max: 30
}
export const db = pgp(dbConnection);

// Test DB Connection
db.connect().then(obj => {
    const serverVersion = obj.client.serverVersion;
    obj.done();
    console.log("Server Connected to Database! Version: " + serverVersion);
}).catch(error => {
    console.log('ERROR: ', error.message || error);
})

app.listen(8080, () => {
    console.log('Server listening on port 8080');
});