import express from 'express'
import session from 'express-session'
import passport from 'passport'
import cors from 'cors'

import dotenv from 'dotenv'
dotenv.config({ path: './.env'});

import authRouter from './routes/auth.mjs'

const app = express();

app.use(cors());

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

app.get('/', (request, response) => {
    console.log(request.session);
    console.log(request.session.id);
    request.session.visited = true;

    response.send('Hello World!');
});


app.listen(8080, () => {
    console.log('Server listening on port 8080');
});