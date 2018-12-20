'use strict'

/*
|--------------------------------------------------------------------------
| Factory
|--------------------------------------------------------------------------
|
| Factories are used to define blueprints for database tables or Lucid
| models. Later you can use these blueprints to seed your database
| with dummy data.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */

const Factory = use('Factory')

Factory.blueprint('App/Model/Post', fake => {
  return {
    title: fake.sentence(),
    body: fake.paragraph()
  }
})

Factory.blueprint('App/Models/User', faker => {
  return {
    username: faker.username(),
    password: faker.password()
  }
})
