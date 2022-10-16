import * as dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import sequelize from './db.js';
import fileUpload from 'express-fileupload';
import {
  UserController,
  DeviceController,
  BrandController,
  TypeController,
  ReviewController,
  BasketController,
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
app.get('/device', DeviceController.getAll);
app.get('/device/:id', DeviceController.getOne);
app.get('/hit', DeviceController.getAllHit);
app.get('/sale', DeviceController.getAllSale);
app.post('/device', chaeckRole('ADMIN'), DeviceController.create);
app.patch('/device', chaeckRole('ADMIN'), DeviceController.update);
app.delete('/device/:id', chaeckRole('ADMIN'), DeviceController.deleteOne);
app.get('/reviews', DeviceController.getAllReviews);

// REVIEWS
app.post('/review', ReviewController.create);

// BRAND
app.get('/brand', BrandController.getAll);
app.post('/brand', chaeckRole('ADMIN'), BrandController.create);
app.patch('/brand', chaeckRole('ADMIN'), BrandController.update);
app.delete('/brand/:id', chaeckRole('ADMIN'), BrandController.destroy);

// TYPE
app.get('/type', TypeController.getAll);
app.post('/type', chaeckRole('ADMIN'), TypeController.create);
app.patch('/type', chaeckRole('ADMIN'), TypeController.update);
app.delete('/type/:id', chaeckRole('ADMIN'), TypeController.destroy);

// BASKET
app.post('/basket', AuthMiddleware, BasketController.add);
app.get('/basket/:id', AuthMiddleware, BasketController.getAll);
app.post('/order', BasketController.confirm);
app.delete('/basket/:id', AuthMiddleware, BasketController.remove);
// RATING
app.get('/rating');

app.use(errorHnadller);

app.listen(process.env.PORT || 4444, (err) => {
  if (err) {
    return console.log(err);
  }

  console.log('Server OK');
});
