import { Router } from 'express'
import { StatusCodes } from 'http-status-codes'

const router = Router()
router
  .route('/')
  .get((req, res) => {
    res.status(StatusCodes.OK).json({ message: '[GET] board' })
  })
  .post((req, res) => {
    res.status(StatusCodes.CREATED).json({ message: '[POST] board' })
  })

export default router
