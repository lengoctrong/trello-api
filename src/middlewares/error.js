import { StatusCodes } from 'http-status-codes'
import env from '~/config/environment'

export default (err, req, res, next) => {
  let { statusCode, message, stack } = err

  if (!statusCode) {
    statusCode = StatusCodes.INTERNAL_SERVER_ERROR
  }
  if (!message) {
    message = StatusCodes[err.statusCode]
  }
  const resErr = {
    statusCode,
    message,
    [env.BUILD_MODE === 'dev' && 'stack']: stack
  }

  if (env.BUILD_MODE !== 'dev') delete resErr.stack

  res.status(resErr.statusCode).json(resErr)
}
