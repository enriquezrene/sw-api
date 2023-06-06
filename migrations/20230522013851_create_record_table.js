exports.up = function (knex) {
  return knex.schema
    .createTable('record', table => {
      table.increments('id')
      table.integer('operation_id')
      table.integer('user_id')
      table.integer('amount'),
        table.integer('user_balance'),
        table.string('operation_response'),
        table.datetime('date'),
        table.datetime('deleted_at'),
        table.foreign('operation_id').references('operation.id'),
        table.foreign('user_id').references('user.id')
    })
};

exports.down = function (knex) {
  return knex.schema.dropTable('record')
};
