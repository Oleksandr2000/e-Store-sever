import express from 'express';
import cors from 'cors';
import sequelize from './db.js';
import fileUpload from 'express-fileupload';
import {
  UserController,
  DeviceController,
  BrandController,
  TypeController,
} from './controllers/index.js';
import { errorHnadller } from './middleware/ErrorHandlingMiddleware.js';
import path from 'path';
import commonjsVariables from 'commonjs-variables-for-esmodules';
import { AuthMiddleware } from './middleware/AuthMiddleware.js';
import { chaeckRole } from './middleware/CheckRoleMiddleware.js';

const { __dirname } = commonjsVariables(import.meta);

const app = express();

const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
  } catch (error) {
    console.log(error);
  }
};

start();

app.use(cors());
app.use(express.json());
app.use(express.static(path.resolve(__dirname, 'static')));
app.use(fileUpload({}));

// USER
app.post('/register', UserController.register);
app.post('/login', UserController.login);
app.get('/auth', AuthMiddleware, UserController.chaeckAuth);

// DEVICE
app.post('/device', chaeckRole('ADMIN'), DeviceController.create);
app.get('/device', DeviceController.getAll);
app.get('/hit', DeviceController.getAllHit);
app.get('/sale', DeviceController.getAllSale);
app.get('/device/:id', DeviceController.getOne);

// BRAND
app.get('/brand', BrandController.getAll);
app.post('/brand', chaeckRole('ADMIN'), BrandController.create);

// TYPE
app.get('/type', TypeController.getAll);
app.post('/type', chaeckRole('ADMIN'), TypeController.create);

// RATING
app.get('/rating');

app.use(errorHnadller);

app.listen(process.env.PORT || 4444, (err) => {
  if (err) {
    return console.log(err);
  }

  console.log('Server OK');
});
