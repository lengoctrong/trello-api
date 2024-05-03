import express from 'express'
import userController from '~/controllers/userController'
import userValidation from '~/validations/userValidation'

const router = express.Router()

router.route('/').post(userValidation.create, userController.create)

export default router
