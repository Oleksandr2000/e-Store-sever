import * as dotenv from 'dotenv';
dotenv.config();
import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(
  'd786o8etkud9jk', // NAME DB
  'kbelfgxbdipyuv', // User
  '33b622f92ca3b984c7f295abb1037ddebaca5645751791fc3d6cbe2f1cc5645c',
  {
    dialect: 'postgres',
    host: 'ec2-54-76-43-89.eu-west-1.compute.amazonaws.com',
    port: 5432,
    dialectOptions: {
      ssl: {
        require: true, // This will help you. But you will see nwe error
        rejectUnauthorized: false, // This line will fix new error
      },
    },
  },
);

export default sequelize;
