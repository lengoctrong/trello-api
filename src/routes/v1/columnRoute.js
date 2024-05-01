import express from 'express'
import columnController from '~/controllers/columnController'
import columnValidation from '~/validations/columnValidation'
const router = express.Router()
router.route('/').post(columnValidation.create, columnController.create)

export default router
