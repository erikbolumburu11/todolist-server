import { db } from '../index.mjs'
import { hashPassword } from './authentication.mjs';

export function RegisterUser(username, password, response){
    db.one("SELECT COUNT(username) FROM users WHERE username = $1", username)
    .then((data) => {
        if(data.count > 0) throw new Error("Username is already taken!");

        const hashedPassword = hashPassword(password);
        db.none('INSERT INTO users(username, password) VALUES($1, $2)',
            [
                username, 
                hashedPassword
            ]
        );

        return response.status(200).send();
    })
    .catch((error) => {
        return response.status(400).send(error.toString());
    })
}

export async function GetUserFromUsername(username){
    return new Promise ((resolve) => {
        db.one("SELECT * FROM users WHERE username = $1", username)
        .then((data) => {
            resolve({
                "id": data.id,
                "username": data.username,
                "password": data.password
            });
        })
        .catch((error) => {
            console.log(error);
            resolve(null);
        })
    });
}

export async function GetUserByID(id){
    return new Promise ((resolve) => {
        db.one("SELECT * FROM users WHERE id = $1", id)
        .then((data) => {
            resolve({
                "id": data.id,
                "username": data.username,
                "password": data.password
            });
        })
        .catch((error) => {
            console.log(error);
            resolve(null);
        })
    });
}