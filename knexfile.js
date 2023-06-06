module.exports = {
  test: {
    client: 'pg',
    connection: {
      database: 'challenge',
      user: 'user',
      password: 'pass',
      port: 5433,
      host: 'localhost',
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  development: {
    client: 'pg',
    connection: {
      database: 'challenge',
      user: 'user',
      password: 'pass',
      port: 5432,
      host: 'localhost',
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  production: {
    client: 'pg',
    connection: {
      database: 'zdvozcri',
      user: 'zdvozcri',
      password: 'exjgGSsF8v3C4HRYTXEFZBK8PsYbgEqu',
      port: 5432,
      host: 'rajje.db.elephantsql.com'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }

};
