import express from 'express'
import cardController from '~/controllers/cardController'
import cardValidation from '~/validations/cardValidation'
const router = express.Router()
router
  .route('/')
  .put(
    cardValidation.updateAllCardsColumnId,
    cardController.updateAllCardsColumnId
  )
  .get(cardController.getAll)
  .post(cardValidation.create, cardController.create)

router.route('/:id').put(cardValidation.update, cardController.update)

export default router
