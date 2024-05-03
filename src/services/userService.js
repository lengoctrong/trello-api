import { StatusCodes } from 'http-status-codes'
import userModel from '~/models/userModel'
import ApiError from '~/utils/ApiError'

const create = async (data) => {
  try {
    const { email, password, type } = data

    const userData = {
      email,
      password,
      name: email.split('@')[0],
      role: 'user'
    }

    if (type === 'login') {
      const existingUser = await userModel.findUser({ email, password })
      if (!existingUser) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')
      }
      return existingUser
    }

    if (type === 'register') {
      const result = await userModel.create(userData)
      return await userModel.findOneById(result.insertedId)
    }
  } catch (err) {
    throw err
  }
}

export default {
  create
}
