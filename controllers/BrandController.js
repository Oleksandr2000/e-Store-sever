import { Brand } from '../models/models.js';

export const create = async (req, res) => {
  try {
    const { name } = req.body;
    const brand = await Brand.create({ name: name });
    return res.json(brand);
  } catch (error) {
    console.log(error);
  }
};

export const getAll = async (req, res) => {
  const brands = await Brand.findAll();
  return res.json(brands);
};
