import express from 'express'
import { StatusCodes } from 'http-status-codes'
import boardController from '~/controllers/boardController'
import boardValidation from '~/validations/boardValidation'
const router = express.Router()
router
  .route('/')
  .get((req, res) => {
    res.status(StatusCodes.OK).json({ message: '[GET] board' })
  })
  .post(boardValidation.create, boardController.create)

router
  .route('/supports/moving_card')
  .put(boardValidation.moveCardOtherColumn, boardController.moveCardOtherColumn)

router
  .route('/:id')
  .get(boardController.getDetails)
  .put(boardValidation.update, boardController.update)

export default router
