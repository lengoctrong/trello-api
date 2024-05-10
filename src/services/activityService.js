import { StatusCodes } from 'http-status-codes'
import activityModel from '~/models/activityModel'
import ApiError from '~/utils/ApiError'

const create = async (data) => {
  try {
    const result = await activityModel.create(data)
    return await activityModel.findOneById(result.insertedId)
  } catch (err) {
    throw err
  }
}

const getAll = async () => {
  try {
    const result = await activityModel.getAll()
    if (!result) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Activities not found')
    }

    return result
  } catch (err) {
    throw err
  }
}

export default {
  create,
  getAll
}
