import { Router } from 'express'
import { StatusCodes } from 'http-status-codes'
import boardRoute from './boardRoute'

const router = Router()
router.get('/status', (req, res) => {
  res.status(StatusCodes.OK).json({ message: 'APIs are ready to use' })
})
router.use('/', boardRoute)
export default router
