exports.seed = async function (knex) {
  await knex('operation').del()
  await knex('operation').insert([
    {type: 'sum', cost: 10},
    {type: 'subtract', cost: 11},
    {type: 'multiply', cost: 12},
    {type: 'divide', cost: 13},
    {type: 'squareRoot', cost: 14},
    {type: 'randomString', cost: 15},
  ]);
};
