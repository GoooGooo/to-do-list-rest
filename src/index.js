import express, { json } from 'express';
import db, {
    User,
    Project
} from './db.js';
import crypto from 'crypto';

import { v4 as uuidv4 } from 'uuid'; 

const SECRET_KEY = "3GJ?8O4xTGknFP}cFxvt"

// const express = require('express')
const app = express()
const port = 3000

//middleware, которое формирует свойство req.body
app.use(express.json())

// respond with "hello world" when a GET request is made to the homepage
app.get('/', (req, res) => {
    res.send('hello world')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})


// {
//   "userName": "Гульнара",
//   "projects": [],
//   "email": "test@test.test",
//   "password": "123",
//   "isBlocked": false,
//   "isConfirm": false  
// }


//принимаем запрос на создание юзера
app.post('/api/v1/signup', (req, res) => {

    
    //вытаскаиваем из тела запроса (req.body) поля userName,email..
    //присваиваем эти поля к константам
    const {
        userName,
        email,
        password
    } = req.body

    //var userName = req.body.userName


    // получаем secret key для хэширования пароля
    const hash = crypto.createHmac('sha512', SECRET_KEY);
    hash.update(password);
    const passwordHash = hash.digest('hex');

    //создается объект юзер на основе данных из req.body
    const user = new User({
        userName,
        email,
        password: passwordHash,
        isBlocked: false,
        isConfirm: false
    });


    //сохраняю объект юзер через mongoose в mongoDB
    user.save(function (err) {
        //mongoose.disconnect();  // отключение от базы данных

        if (err) return console.log(err);
        console.log("Сохранен объект", user);
    });


    //отпраляю ответ с кодом 200
    res.send('/api/v1/signup POST')
})

app.post('/api/v1/login', (req, res) => {
    res.send('/api/v1/login POST')
})

app.get('/api/v1/login', (req, res) => {
    res.send('/api/v1/login GET')
})

app.get('/api/v1/logout', (req, res) => {
    res.send('/api/v1/logout GET')
})

app.patch('/api/v1/reset', (req, res) => {
    res.send('/api/v1/reset PATCH')
})

app.post('/api/v1/project', (req, res) => {

    const {
        projectName,
        userId
    } = req.body

    const project = new Project({
        projectName,
        userId
    })

    console.log("project", project)
    project.save(function (err) {
        //mongoose.disconnect();  // отключение от базы данных

        if (err) return console.log(err);
        console.log("Сохранен объект", project);
    });

    res.send('/api/v1/project POST')
    //возвращаем созданный проект
})


//достаем из mongoDB данные о проекте
app.get('/api/v1/project', async(req, res) => {
    console.log(req.query.userId)
    
    const projectsFinded = await Project.find({userId: req.query.userId}, '_id projectName')
    console.log(projectsFinded)

    const body = JSON.stringify(projectsFinded)
    //возвращаем все проекты  

    res
    .writeHead(200, {
        'Content-Length': Buffer.byteLength(body),
        'Content-Type': 'application/json'
    })
    .end(body);
})

app.post('/api/v1/task', async (req, res) => {

    const {
        taskName,
        userId,
        projectId
    } = req.body

    console.log(uuidv4())

    const task = {
        taskId: uuidv4(),
        taskName,
        flag: false,
        createdAt: Date.now(),
        isDone: false
    }

    const projectFinded = await Project.findById(projectId)
    console.log(projectFinded)

    projectFinded.tasks.push(task)
    await projectFinded.save()

    const body = JSON.stringify ({
        taskId: task.taskId
    });

    res
        .writeHead(201, {
            'Content-Length': Buffer.byteLength(body),
            'Content-Type': 'application/json'
        })
        .end(body);

})

//д.з. написать комменты к каждому куску кода
// как вынести маршруты (app.post, app.get etc.) в отдельный файл
// создать отдельные файлы для каждой сущности и импортировать в один(taskApi.js)

// app.get('/api/v1/task', (req, res) => {
//     res.send('/api/v1/task GET')
    
// })
//возвращаем задачи по get фильтрам, например: все отмеченные flagged, completed tasks, таски, которые были созданы сегодня


app.get('/api/v1/project/:id', async(req, res) => {

    const _id = req.params.id

    const projectFinded = await Project.findOne({_id})
    console.log(projectFinded)

    const body = JSON.stringify(projectFinded)

    res
    .writeHead(200, {
        'Content-Length': Buffer.byteLength(body),
        'Content-Type': 'application/json'
    })
    .end(body);

})

app.patch('/api/v1/project/:id', async(req, res) => {

    const _id = req.params.id

    const { projectName } = req.body

    const project = await Project.findOneAndUpdate({_id},{$set:{projectName}}, null, function (err, docs) {
        if (err){
            console.log(err)
        }
        else{
            console.log("Updated Docs : ", docs);
        }
    })
    // const project = await Project.findOne({_id})
    console.log(project)


    // project.save(function (err) {

    //     if (err) return console.log(err);
    //     console.log("Сохранен объект", project);
    // });

    res.send('/api/v1/project/:id PATCH')
    //изменяем проект по id-шнику
})

app.delete('/api/v1/project/:id', (req, res) => {
    res.send('/api/v1/project/:id DELETE')
    //удаляем проект по id-шнику
})

// app.get('/api/v1/task/:id', (req, res) => {
//     res.send('/api/v1/task/:id GET')
//     //возвращаем task по id-шнику
// })

app.patch('/api/v1/task/:id', (req, res) => {
    res.send('/api/v1/task/:id PATCH')
    console.log(req.body)
    console.log(req.params)
    //изменяем task по id-шнику
})

app.delete('/api/v1/task/:id', (req, res) => {
    res.send('/api/v1/task/:id DELETE')
    //удаляем task по id-шнику
})

//проанализировать комменты выше, что получает каждый маршрут при запросе

//создать репозиторий и запушить сервер часть проекта
//реализовать патч и делит