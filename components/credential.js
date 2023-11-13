import { Pool } from 'pg';

const pool = new Pool({
  user: 'initial_db',
  host: 'q-db-1.cxtsp2fldgag.us-east-1.rds.amazonaws.com',
  database: 'q-db-1',
  password: 'Quest@DB!PT',
  port: '5432',
});

export default pool;
