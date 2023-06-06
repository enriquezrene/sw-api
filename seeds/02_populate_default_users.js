exports.seed = async function (knex) {
  await knex('user').del()
  await knex('user').insert([
    {username: 'a@foo.com', password: '1234567890', status: 'active', balance: 999999999},
    {username: 'user-no-balance@foo.com', password: '1234567890', status: 'active', balance: 0},
    {username: 'wrong@foo.com', password: '1234567890', status: 'inactive', balance: 999999999},
  ]);
};
