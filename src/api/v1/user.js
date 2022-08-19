import { Router } from 'express';
import jwt from 'jsonwebtoken';

const router = Router();

import db, {
    User
} from '../../db.js';

import {
    v4 as uuidv4
} from 'uuid';

import crypto from 'crypto';
const SECRET_KEY = "3GJ?8O4xTGknFP}cFxvt"

//принимаем запрос на создание юзера
router.post('/signup', (req, res) => {


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
        isConfirm: false,
        confirmationCode: uuidv4()
    });

    //сохраняю объект юзер через mongoose в mongoDB
    user.save(function (err) {
        //mongoose.disconnect();  // отключение от базы данных

        if (err) return console.log(err);
        console.log("Сохранен объект", user);
    });

    // Отправляем email для подтверждения
    console.log(`<div><h1>Email Confirmation</h1>
    <h2>Hello ${user.userName}</h2>
    <p>Thank you for registration. Please confirm your email by clicking on the following link</p>
    <a href=http://localhost:3000/api/v1/confirm/${user.confirmationCode}> Click here</a>
    </div>`)

    //отпраляю ответ с кодом 201
    res
        .writeHead(201, {
            'Content-Length': 0
        })
        .end();
})


router.get('/confirm/:code', async(req, res) => {
    
    //Получаем код подтверждения из url по нажатой ссылке
    const code = req.params.code;
    //Находим пользователя, который подтверждает свой email по коду подтверждения
    const userFinded = await User.findOne({
        isConfirm: false,
        confirmationCode: code
    })

    if(userFinded) {
        userFinded.isConfirm = true
        userFinded.save((err) => {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }
            res
                .writeHead(301, {
                    'Location': '/login/?confirmated'
                })
                .end();
          });
    } else { 
        return res.status(404).send({ message: "User Not found." });
    }
})

router.post('/login', async(req, res) => {
    // 0. По email и password найти пользователя в базе
    // и если пользователь подтвержден и не заблокирован

    const userFinded = await User.findOne({
        isConfirm: true,
        isBlocked: false,
        email: req.body.email
    })

    if(userFinded) {
        const hash = crypto.createHmac('sha512', SECRET_KEY);
        hash.update(req.body.password);
        const passwordHash = hash.digest('hex');

        if(userFinded.password !== passwordHash) {
            return res.status(403).json({ message: "Incorrect password" });
        }
         // 1. Сгенерировать токен
        const token = jwt.sign({
            email: userFinded.email
          }, SECRET_KEY, { expiresIn: '1h' }); 
          
        // 2. Отдать токен
        return res.status(200).json({
            id: userFinded._id,
            token
            })
    } else { 
        return res.status(404).json({ message: "User Not found." });
    }

})

// router.get('/login', (req, res) => {
//     res.send('/login GET')
// })

router.get('/logout', (req, res) => {
    res.send('/logout GET')
})

router.patch('/reset', (req, res) => {
    res.send('/reset PATCH')
})


export default router;
