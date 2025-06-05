import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken';
import { GetUserByID } from './userQueries.mjs';

export function hashPassword(password){
    const salt = bcrypt.genSaltSync();
    return bcrypt.hashSync(password, salt);
}

export function comparePassword(raw, hash){
    return bcrypt.compareSync(raw, hash);
}

export function authenticateJWT(request, response, next) {
    const authHeader = request.headers.authorization;
    if(!authHeader) return response.status(401).send();

    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.JWT_SECRET, async (error, user) => {
        if(error) return response.sendStatus(403);
        request.user = await GetUserByID(user.id);
        next();
    })
}