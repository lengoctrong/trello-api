/* eslint-disable no-console */
import express from 'express'
import { env } from '~/config/environment.js'
import { db } from '~/config/mongodb'
import routerApi from '~/routes'

const server = {
  connect() {
    const app = express()
    app.use(routerApi)

    app.listen(env.LOCAL_PORT, () => {
      console.log(
        `The server is running at http://${env.LOCAL_HOST}:${env.LOCAL_PORT}`
      )
    })
  }
}

;(async () => {
  try {
    console.log('Connecting to database...')
    await db.connect()

    console.log('Connected to database!')
    server.connect()
  } catch (err) {
    console.log(err)
    process.exit(0)
  }
})()
