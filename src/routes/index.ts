import { Router } from 'express'
import * as userController from '../Controllers/userController'

const routes = Router()

routes.post('/users', userController.createUser);
routes.get('/users', userController.getUsersData);


routes.get('/healt', (req, res) => {
  console.log('app is working')
  return res.send('app is working').status(200)
})

export default routes
