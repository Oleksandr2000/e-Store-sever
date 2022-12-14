import { Brand } from '../models/models.js';

export const create = async (req, res) => {
  try {
    const { name } = req.body;
    const brand = await Brand.findOne({ where: { name: name } });

    if (!brand) {
      await Brand.create({ name: name });

      return res.json('succees').status(200);
    }

    return res.status(404).json('brand is already exist');
  } catch (error) {
    console.log(error);
  }
};

export const update = async (req, res) => {
  try {
    const { name, id } = req.body;

    await Brand.update({ name: name }, { where: { id: id } });

    return res.json('succees').status(200);
  } catch (error) {
    console.log(error);
  }
};

export const getAll = async (req, res) => {
  const brands = await Brand.findAll();
  return res.json(brands);
};

export const destroy = async (req, res) => {
  const { id } = req.params;

  await Brand.destroy({
    where: { id },
  });

  res.status(200).json('succes');
};
