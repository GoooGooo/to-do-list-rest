import express from 'express';
import routes from './api/v1/routes.js';
import jwt from 'jsonwebtoken';
import config from 'config'

const { API_VERSION, PORT } = config
// console.log(config.get('PORT'))

const app = express()


//middleware, которое формирует свойство req.body
app.use(express.json())
app.use((req, res, next) => {
    if (req.headers.authorization) {
      jwt.verify(
        req.headers.authorization.split(' ')[1],
        tokenKey,
        (err, payload) => {
          if (err) next()
          else if (payload) {
            // В базе по id ищем пользователя
            // for (let user of users) {
            //   if (user.id === payload.id) {
            //     req.user = user
            //     next()
            //   }
            // }
  
            if (!req.user) next()
          }
        }
      )
    }
  
    next()
  })

app.use(API_VERSION + '/project', routes.project);
app.use(API_VERSION + '/', routes.user);

// console.log(app._router.stack)


// respond with "hello world" when a GET request is made to the homepage
app.get('/', (req, res) => {
    res.send('hello world')
})

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`)
})


