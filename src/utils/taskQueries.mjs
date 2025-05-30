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

export function updateTask(updates, taskid, requestUserId, response){
    const keys = Object.keys(updates);
    const setClauses = keys.map((key, index) => `${key} = $${index + 1}`);
    const values = Object.values(updates);

    const query = `
        UPDATE tasks 
        SET ${setClauses.join(',')}
        WHERE id = $${keys.length + 1} AND userid = $${keys.length + 2}
        RETURNING *
    `;

    db.one(query,
        [
            ...values,
            taskid,
            requestUserId
        ]
    ).then((data) => {
        return response.status(200).send({data});
    }).catch((error) => {
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