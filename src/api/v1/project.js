import { Router } from 'express';

const router = Router();

import db, {
    Project
} from '../../db.js';

import {
    v4 as uuidv4
} from 'uuid';

//accept a request to create a project
router.post('/', (req, res) => {

    //extract the projectName, userId fields from the request body (req.body).
    //assign these fields to constants
    const {
        projectName,
        userId
    } = req.body

    //create project object based on the data from req.body
    const project = new Project({
        projectName,
        userId
    })

    //save the project through mongoose to mongoDB
    let d = project.save(function (err) {
        //mongoose.disconnect();

        if (err) return console.log(err);
        console.log("Сохранен объект", project);
    });

    //sending response with code 201
    res
        .writeHead(201, {
            'Content-Length': 0,
            'Location': 'api/v1/project/' + project._id, 
            'Content-Type': 'application/json'
        })
        .end();
})


// get project data from mongoDB
router.get('/', async (req, res) => {
    console.log(req.query.userId)

    const projectsFinded = await Project.find({
        userId: req.query.userId
    }, '_id projectName')
    console.log(projectsFinded)

    const body = JSON.stringify(projectsFinded)
    //return all found projects 

    res
        .writeHead(200, {
            'Content-Length': Buffer.byteLength(body),
            'Content-Type': 'application/json'
        })
        .end(body);
})


router.get('/:id', async (req, res) => {

    const _id = req.params.id

    const projectFinded = await Project.findOne({
        _id
    })
    console.log(projectFinded)

    const body = JSON.stringify(projectFinded)

    res
        .writeHead(200, {
            'Content-Length': Buffer.byteLength(body),
            'Content-Type': 'application/json'
        })
        .end(body);

})

router.patch('/:id', async (req, res) => {

    const _id = req.params.id

    const {
        projectName
    } = req.body
    
    const project = await Project.findOneAndUpdate({
        _id
    }, {
        $set: {
            projectName
        }
    }, null, function (err, docs) {
        if (err) {
            console.log(err)
        } else {
            console.log("Updated Docs : ", docs);
        }
    }).clone().catch(function (err) {
        console.log(err)
    })
    
    const body = JSON.stringify(project)

    res
        .writeHead(200, {
            'Content-Length': Buffer.byteLength(body),
            'Content-Type': 'application/json'
        })
        .end(body);
    //изменяем проект по id-шнику
})

router.delete('/:id', async (req, res) => {

    const _id = req.params.id

    const projectDeleted = await Project.findOneAndRemove({
            _id
        },
        function (err, docs) {
            if (err) {
                console.log(err)
            } else {
                console.log("Removed User : ", docs);
            }
        }).clone().catch(function (err) {
            console.log(err)
        });
    console.log(projectDeleted)

    res
        .writeHead(204)
        .end();
    //удаляем проект по id-шнику
})

router.post('/:pid/task', async (req, res) => {

    //Получаем :pid (project id) проекта из url
    const projectId = req.params.pid;

    //Получаем название новой задачи из тела POST-запроса
    const {
        taskName,
        userId,
    } = req.body

    //Формируем новую задачу
    const task = {
        taskId: uuidv4(),
        taskName,
        flag: false,
        createdAt: Date.now(),
        isDone: false
    }

    //Находим проект для вставки созданной задачи
    const projectFinded = await Project.findById(projectId)

    //Добавляем задачу в проект
    projectFinded.tasks.push(task)
    //Созраняем изиененный проект в базе MongoDB
    await projectFinded.save()


    //Формируем ответ: id вновь созданной задачи
    const body = JSON.stringify({
        taskId: task.taskId
    });

    //Отправляем ответ клиенту
    res
        .writeHead(201, {
            'Content-Length': Buffer.byteLength(body),
            'Content-Type': 'application/json'
        })
        .end(body);

})


// router.get('/api/v1/task', (req, res) => {
//     res.send('/api/v1/task GET')

// })
//возвращаем задачи по get фильтрам, например: все отмеченные flagged, completed tasks, таски, которые были созданы сегодня


// router.get('/:pid/task/:id', (req, res) => {
//     res.send('/:pid/task/:id GET')
//     //возвращаем task по id-шнику
// })

router.patch('/:pid/task/:id', async(req, res) => {

    const taskId = req.params.id

    const projectId = req.params.pid

    const {
        taskName,
        isDone,
        flag
    } = req.body

    const projectFinded = await Project.findOne({
        projectId
    })
    
    const tasks = projectFinded.tasks

    const task = tasks.find(item => item.taskId === taskId)

    if (taskName) {
        task.taskName = taskName
    }

    if (isDone) {
        task.isDone = isDone
    }

    if (flag) {
        task.flag = flag
    }
   
    projectFinded.save()

    const body = JSON.stringify(task);

    res
        .writeHead(201, {
            'Content-Length': Buffer.byteLength(body),
            'Content-Type': 'application/json'
        })
        .end(body);
    //изменяем task по id-шнику
})

router.delete('/:pid/task/:id', async(req, res) => {

    const taskId = req.params.id

    const projectId = req.params.pid

    const projectFinded = await Project.findOne({
        projectId
    })
    
    const tasks = projectFinded.tasks

    projectFinded.tasks = tasks.filter(item => item.taskId != taskId)

    projectFinded.save()

    res
        .writeHead(204)
        .end();
    //удаляем task по id-шнику
})

export default router;
