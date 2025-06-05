import { Router } from "express";
import { GetUserByID, GetUserFromUsername, RegisterUser } from "../utils/userQueries.mjs";
import jwt from 'jsonwebtoken';
import { authenticateJWT, comparePassword } from "../utils/authentication.mjs";

const authRouter = Router();

authRouter.post('/login/', async (request, response) => {
    const user = await GetUserFromUsername(request.body.username);
    if(!user) response.status(401).send("Invalid Credentials");
    if(!comparePassword(request.body.password, user.password)) response.status(401).send("Invalid Credentials");

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    response.json({ token });
});

authRouter.post('/register/', (request, response) => {
    return RegisterUser(request.body.username, request.body.password, response);
});

authRouter.get('/status/', authenticateJWT, (request, response) => {
    if(request.user){
        response.status(200).send();
    }
    else {
        response.status(401).send({msg: 'Not authenticated'});
    }
});

authRouter.get('/userdata/', authenticateJWT, async (request, response) => {
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
