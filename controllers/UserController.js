import { AppError } from '../error/AppError.js';
import { Basket, User } from '../models/models.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const generateJwt = (id, email, role) => {
  return jwt.sign({ id, email, role }, 'SECRET_KEY', { expiresIn: '24h' });
};

export const register = async (req, res, next) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password) {
      return next(AppError.badRequest('Invalid data'));
    }
    const candidate = await User.findOne({ where: { email } });
    if (candidate) {
      return next(AppError.badRequest('user already exists'));
    }
    const hashPassword = await bcrypt.hash(password, 5);
    const user = await User.create({ email: email, role: role, password: hashPassword });
    const basket = await Basket.create({ userId: user.id });
    const token = generateJwt(user.id, user.email, user.role);

    return res.json({ token });
  } catch (error) {
    console.log(error);
  }
};

export const login = async (req, res, next) => {
  const { email, password, role } = req.body;

  const user = await User.findOne({ where: { email } });
  if (!user) {
    return next(AppError.badRequest('user not found'));
  }

  let comparePassword = bcrypt.compareSync(password, user.password);

  if (!comparePassword) {
    return next(AppError.badRequest('invalid data'));
  }
  const token = generateJwt(user.id, user.email, user.role);
  return res.json({ token, user });
};

export const chaeckAuth = async (req, res) => {
  const user = await User.findOne({ where: { email: req.user.email } });
  const token = generateJwt(req.user.id, req.user.email, req.user.role);
  return res.json({ token, user });
};
