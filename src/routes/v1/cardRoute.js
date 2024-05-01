import express from 'express'
import cardController from '~/controllers/cardController'
import cardValidation from '~/validations/cardValidation'
const router = express.Router()
router.route('/').post(cardValidation.create, cardController.create)

export default router
