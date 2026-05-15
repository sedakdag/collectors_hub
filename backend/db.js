const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://yapsed:12345@db:5432/collectors_hub'
});

module.exports = pool;