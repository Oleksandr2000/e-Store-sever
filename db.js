import * as dotenv from 'dotenv';
dotenv.config();
import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(
  'dda0kl4mirq46i', // NAME DB
  'ajkbbdleianlkv', // User
  'c6b099e6ed70efd92144698cc105cf303b339f6d491c943c3db335dd9a2a6a2c',
  {
    dialect: 'postgres',
    host: 'ec2-34-241-90-235.eu-west-1.compute.amazonaws.com',
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
