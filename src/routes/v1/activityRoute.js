import express from 'express'
import activityController from '~/controllers/activityController'
import activityValidation from '~/validations/activityValidation'

const router = express.Router()

router
  .route('/')
  .get(activityController.getAll)
  .post(activityValidation.create, activityController.create)

export default router
