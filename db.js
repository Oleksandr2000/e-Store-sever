import * as dotenv from 'dotenv';
dotenv.config();
import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(
  process.env.DB_NAME, // NAME DB
  process.env.DB_USER, // User
  process.env.DB_PASSWORD, // PASSWORD
  {
    dialect: 'postgres',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialectOptions: {
      ssl: {
        require: true, // This will help you. But you will see nwe error
        rejectUnauthorized: false, // This line will fix new error
      },
    },
  },
);

export default sequelize;
