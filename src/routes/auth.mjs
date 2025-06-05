import { Router } from "express";
import passport from 'passport'
import '../strategies/local-strategy.mjs'
import { RegisterUser } from "../utils/userQueries.mjs";

const authRouter = Router();

authRouter.post('/login/', passport.authenticate('local'), (request, response) => {
    response.send(200);
});

authRouter.post('/logout/', (request, response) => {
    if(!request.user) return response.sendStatus(401);
    request.logout((err) => {
        if(err) return response.sendStatus(400);
        response.send(200);
    });
});

authRouter.post('/register/', (request, response) => {
    return RegisterUser(request.body.username, request.body.password, response);
});

authRouter.get('/status/', (request, response) => {
    if(request.user){
        response.status(200).send();
    }
    else {
        response.status(401).send({msg: 'Not authenticated'});
    }
});

authRouter.get('/userdata/', (request, response) => {
    console.log('Session:', request.session);
    console.log('User:', request.user);
    if(request.user){
        response.status(200).send({
            id: request.user.id,
            username: request.user.username,
        });
    }
    else {
        response.status(401).send({msg: 'Not authenticated'});
    }
});

export default authRouter;
