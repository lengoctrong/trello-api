import express from 'express'
import boardController from '~/controllers/boardController'
import boardValidation from '~/validations/boardValidation'
const router = express.Router()
router
  .route('/')
  .get(boardController.getAll)
  .post(boardValidation.create, boardController.create)

router
  .route('/:id')
  .get(boardController.getDetails)
  .put(boardValidation.update, boardController.update)
  .delete(boardValidation.deleteItem, boardController.deleteItem)

router
  .route('/supports/moving_card')
  .put(
    boardValidation.moveCardToDifferentColumn,
    boardController.moveCardToDifferentColumn
  )

export default router
