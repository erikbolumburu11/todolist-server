import { Router } from "express";
import { createTask, getUserTasks, setTaskDone } from "../utils/taskQueries.mjs";

const tasksRouter = Router();

tasksRouter.post('/new/', (request, response) => {
    return createTask(request.body.taskName, request.user.id, response);
});

tasksRouter.post('/setdone/', (request, response) => {
    return setTaskDone(request.body.taskid, request.body.done, response);
});

tasksRouter.get('/getusertasks/', (request, response) => {
    if(request.user){
        return getUserTasks(request.user.id, response);
    }
    else {
        response.status(401).send({msg: 'Not authenticated'});
    }
});

export default tasksRouter;