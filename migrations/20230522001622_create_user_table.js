exports.up = function (knex) {
  return knex.schema
    .createTable('user', table => {
      table.increments('id')
      table.string('username').notNullable().unique(),
        table.string('password').notNullable(),
        table.integer('balance'),
        table.datetime('deleted_at'),
        table.enum('status', ['active', 'inactive']).notNullable()
    })
};

exports.down = function (knex) {
  return knex.schema.dropTable('users')
};
