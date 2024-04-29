import boardModel from '~/models/boardModel'
import { slugify } from '~/utils/formatters'
const create = async (data) => {
  const board = {
    ...data,
    slug: slugify(data.title)
  }
  const result = await boardModel.create(board)
  return await boardModel.findOneById(result.insertedId)
}

export default {
  create
}
