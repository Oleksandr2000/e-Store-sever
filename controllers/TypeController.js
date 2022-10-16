import { Type } from '../models/models.js';

export const create = async (req, res) => {
  try {
    const { name } = req.body;

    const findType = await Type.findOne({ where: { name: name } });

    if (findType) {
      return res.status(404).json('error');
    }
    const type = await Type.create({ name: name });

    return res.json(type);
  } catch (error) {
    console.log(error);
  }
};

export const update = async (req, res) => {
  try {
    const { name, id } = req.body;

    await Type.update({ name: name }, { where: { id: id } });

    return res.json('succees').status(200);
  } catch (error) {
    console.log(error);
  }
};

export const getAll = async (req, res) => {
  const types = await Type.findAll();
  return res.json(types);
};

export const destroy = async (req, res) => {
  const { id } = req.params;

  await Type.destroy({
    where: { id },
  });

  res.status(200).json('succes');
};
