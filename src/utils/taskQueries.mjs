import { db } from '../index.mjs'

export function createTask(name, userid, response){
        db.one('INSERT INTO tasks(name, done, userid) VALUES($1, $2, $3) RETURNING id, name, done',
            [
                name,
                false,
                userid
            ]
        ).then((data) => {
            return response.status(200).send({id: data.id, name: data.name, done: data.done});
        }).catch((error) =>{
            return response.status(400).send(error.toString());
        });
}

export function setTaskDone(taskid, done, requestUserId, response){
    db.oneOrNone('UPDATE tasks SET done = $1 WHERE id = $2 and userid = $3',
        [
            done,
            taskid,
            requestUserId
        ]
    ).then(() => {
        return response.status(200).send();
    }).catch((error) => {
        return response.status(400).send(error.toString());
    });
}

export function deleteTask(taskid, requestUserId, response){
    db.oneOrNone('DELETE FROM tasks WHERE id = $1 AND userid = $2',
        [
            taskid,
            requestUserId
        ]
    ).then(() => {
        return response.status(200).send();
    }).catch((error) => {
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