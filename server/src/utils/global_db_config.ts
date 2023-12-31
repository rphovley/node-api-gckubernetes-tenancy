
// // Setting up the database connection
import { Model } from 'objection'
import { getLogger } from './logger'
import './env'

import Knex = require('knex')

const isDev = process.env.NODE_ENV === undefined
const HOST = isDev ? process.env.DB_HOST : `/cloudsql/${process.env.DB_HOST}`

export const config: Knex.Config = {
  client: 'postgres',
  connection: {
    host: HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
    instanceName: 'global-db',
    charset: 'utf8',
  },
}

export const initGlobalObjection = (): Knex => {
  const knex: Knex = initConnection()
  Model.knex(knex)
  return knex
}

export const initConnection = (): Knex => {
  getLogger().warn('Retrieving global db connection')
  const knex: Knex = Knex(config)
  return knex
}
