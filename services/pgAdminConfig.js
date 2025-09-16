import { Pool } from 'pg';

const Client = new Pool({
  user: 'postgres',        
  host: 'localhost',
  database: 'mydb',         
  password: 'VITAMINE321',
  port: 5432,
});

export default Client;
