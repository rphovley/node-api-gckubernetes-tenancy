/* eslint-disable no-console */
/* eslint-disable no-await-in-loop */
import { AppUser, appUser } from '../../test/factories/app_user.factory'
import { getConfigs, tenantConfig } from '../../server/src/utils/tenant_db_config'

import faker = require('faker')
import Knex = require('knex')


/**
 *
 * First, a global seed file. This seeds just companies
 * Second, a company seed file. This seeds everything from administration, to events (including global seeds for event users)
 */
export async function seed(knex: Knex): Promise<void> {
  // Clean db
  await deleteRecords(knex)

  // create admin
  const admin = await AppUser(knex, { roles: ['admin'] })

  // create attendees
  const attendees = []
  knex.select()
  for (let i = 0; i < 100; i++) {
    attendees.push(appUser({ roles: ['attendee'], firebase_uid: faker.random.uuid() })) // firebase_uid comes from a user in our dev firebase auth set
  }

  await knex.batchInsert('app_user', attendees)
}

const deleteRecords = async (knex: Knex): Promise<void> => {
  await knex('app_user').del()
}

const runTenantSeeds = async (): Promise<void> => {
  console.log('Tenant seeds starting')
  const tenantConfigMap = await getConfigs()

  const tenantKnexArr = []
  tenantConfigMap.forEach((config) => {
    tenantKnexArr.push(Knex(config))
  })
  // eslint-disable-next-line no-restricted-syntax
  for (const knex of tenantKnexArr) {
    await seed(knex)
    await knex.destroy()
  }
  console.log('Tenant Seeds completed')
}

runTenantSeeds()
