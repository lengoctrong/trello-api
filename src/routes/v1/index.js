import express from 'express'
import { StatusCodes } from 'http-status-codes'
import boardRoute from './boardRoute'

const router = express.Router()
router.get('/status', (req, res) => {
  res.status(StatusCodes.OK).json({ message: 'APIs V1 are ready to use.' })
})
router.use('/boards', boardRoute)
export default router
