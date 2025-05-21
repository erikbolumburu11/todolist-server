import { Router } from "express";
import { users } from '../utils/users.mjs'
import passport from 'passport'
import '../strategies/local-strategy.mjs'

const authRouter = Router();

authRouter.get('/users/', (request, response) => {
    console.log(request.session);
    console.log(request.session.id);
    request.session.visited = true;
    response.send(users);
});

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

authRouter.get('/status/', (request, response) => {
    if(request.user){
        response.status(200).send(request.user);
    }
    else {
        response.status(401).send({msg: 'Not authenticated'});
    }
});

export default authRouter;
