import express from 'express'
import columnController from '~/controllers/columnController'
import columnValidation from '~/validations/columnValidation'

const router = express.Router()
router.route('/').post(columnValidation.create, columnController.create)

router.route('/:id').put(columnValidation.update, columnController.update)

export default router