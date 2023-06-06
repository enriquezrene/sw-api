exports.up = function (knex) {
  return knex.schema
    .createTable('operation', table => {
      table.increments('id')
      table.integer('cost'),
        table.datetime('deleted_at'),
        table.enum('type', ['sum', 'subtract', 'multiply', 'divide', 'squareRoot', 'randomString']).notNullable()
    })
};

exports.down = function (knex) {
  return knex.schema.dropTable('operation')
};
