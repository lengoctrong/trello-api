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

    const existingUser = await userModel.findUser({ email })

    if (type === 'login' && !existingUser) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Không tìm thấy người dùng!')
    }

    if (type === 'login' && existingUser) return existingUser

    if (type === 'register' && existingUser) {
      throw new ApiError(StatusCodes.CONFLICT, 'Người dùng đã tồn tại!')
    }

    if (type === 'register' && !existingUser) {
      const result = await userModel.create(userData)
      return await userModel.findOneById(result.insertedId)
    }
  } catch (err) {
    throw err
  }
}

const getDetails = async (id) => {
  try {
    const result = await userModel.findOneById(id)
    if (!result) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')
    }
    return result
  } catch (err) {
    throw err
  }
}

export default {
  create,
  getDetails
}
