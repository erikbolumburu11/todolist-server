import { Router } from "express";
import { createGroup, createTask, deleteGroup, deleteTask, getGroups, getGroupTasks, getUserTasks, setTaskDone, updateGroup, updateTask } from "../utils/taskQueries.mjs";
import { authenticateJWT } from "../utils/authentication.mjs";

const tasksRouter = Router();

tasksRouter.post('/new/task/', (request, response) => {
    const groupid = request.body.groupid === -1 ? null : request.body.groupid;
    return createTask(request.body.taskName, request.user.id, request.body.due, groupid, response);
});

tasksRouter.post('/new/group/', authenticateJWT, (request, response) => {
    return createGroup(request.body.groupName, request.user.id, response);
});

tasksRouter.post('/update/task/', authenticateJWT, (request, response) => {
    request.body.updates.groupid = request.body.updates.groupid === -1 ?
        null : 
        request.body.updates.groupid;


    return updateTask(request.body.updates, request.body.taskid, request.user.id, response);
});

tasksRouter.post('/update/group/', authenticateJWT, (request, response) => {
    return updateGroup(request.body.updates, request.body.groupid, request.user.id, response);
});

tasksRouter.post('/delete/task/', authenticateJWT, (request, response) => {
    return deleteTask(request.body.taskid, request.user.id, response);
});

tasksRouter.post('/delete/group/', authenticateJWT, (request, response) => {
    return deleteGroup(request.body.groupid, request.user.id, response);
});

tasksRouter.post('/setdone/', authenticateJWT, (request, response) => {
    return setTaskDone(request.body.taskid, request.body.done, request.user.id, response);
});

tasksRouter.get('/get/', authenticateJWT, (request, response) => {
    if(!request.user) response.status(401).send({msg: 'Not authenticated'});
    return getUserTasks(request.user.id, response);

});

tasksRouter.get('/get/groups/', authenticateJWT, (request, response) => {
    if(!request.user) response.status(401).send({msg: 'Not authenticated'});
    return getGroups(request.user.id, response);
});

tasksRouter.get('/get/:groupid', authenticateJWT, (request, response) => {
    if(!request.user) response.status(401).send({msg: 'Not authenticated'});

    const groupid = request.params.groupid;
    if(groupid === '-1') return getUserTasks(request.user.id, response);

    return getGroupTasks(request.user.id, groupid, response)
});

export default tasksRouter;