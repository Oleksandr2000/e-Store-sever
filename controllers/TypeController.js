import { Type } from '../models/models.js';
import { AppError } from '../error/AppError.js';

export const create = async (req, res) => {
  try {
    const { name } = req.body;
    const type = await Type.create({ name: name });
    return res.json(type);
  } catch (error) {
    console.log(error);
  }
};

export const getAll = async (req, res) => {
  const types = await Type.findAll();
  return res.json(types);
};
