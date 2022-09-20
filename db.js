import { Sequelize } from 'sequelize';

const sequelize = new Sequelize({
  database: 'Electrolux',
  username: 'postgres',
  password: 'admin',
  dialect: 'postgres',
  host: 'localhost',
  port: 5432,
});

export default sequelize;
