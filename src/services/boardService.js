import { StatusCodes } from 'http-status-codes'
import boardModel from '~/models/boardModel'
import ApiError from '~/utils/ApiError'
import { slugify } from '~/utils/formatters'
const create = async (data) => {
  const board = {
    ...data,
    slug: slugify(data.title)
  }
  const doc = await boardModel.create(board)
  return await boardModel.findOneById(doc.insertedId)
}

const getDetails = async (id) => {
  const board = await boardModel.getDetails(id)
  if (!board) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Board not found')
  }
}

export default {
  create,
  getDetails
}
