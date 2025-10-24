import express from 'express'
import { isLogged } from '../controllers/auth.controller.ts'


const router = express.Router()

// TODO:  Order API need to be added
router.post('/order', isLogged, (req, res) => {
  res.send('Home')
})

export default router
