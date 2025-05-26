import { db } from '../index.mjs'

export function createTask(name, userid, response){
        db.none('INSERT INTO tasks(name, done, userid) VALUES($1, $2, $3)',
            [
                name,
                false,
                userid
            ]
        ).then(() => {
            return response.status(200).send();
        }).catch((error) =>{
            return response.status(400).send(error.toString());
        });
}

export function getUserTasks(userid, response){
    db.manyOrNone('SELECT * FROM tasks WHERE userid = $1',
        [
            userid
        ]
    ).then((tasks) => {
        return response.status(200).send(tasks);
    }).catch((error) => {
        return response.status(400).send(error.toString());
    });
}