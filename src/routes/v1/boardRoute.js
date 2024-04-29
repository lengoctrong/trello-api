import { Router } from 'express'
import { StatusCodes } from 'http-status-codes'
import boardController from '~/controllers/boardController'
import boardValidation from '~/validations/boardValidation'
const router = Router()
router
  .route('/')
  .get((req, res) => {
    res.status(StatusCodes.OK).json({ message: '[GET] board' })
  })
  .post(boardValidation.create, boardController.create)

export default router
