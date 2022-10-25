import { v4 } from 'uuid';
import path from 'path';
import { Device, DeviceInfo, Reviews } from '../models/models.js';
import { AppError } from '../error/AppError.js';
import commonjsVariables from 'commonjs-variables-for-esmodules';
import { Op } from 'sequelize';

const { __dirname } = commonjsVariables(import.meta);

export const create = async (req, res, next) => {
  try {
    const { name, price, brandId, typeId, info, hit, sale, discount } = req.body;
    const { img } = req.files;
    console.log(img);
    img.mv(path.resolve(__dirname, '..', 'static', img.name));

    const salePrice = Math.round(price - (price / 100) * discount);

    const device = await Device.create({
      name: name,
      price: salePrice,
      brandId: brandId,
      typeId: typeId,
      hit: hit,
      sale: sale,
      discount: discount,
      img: img.name,
    });

    if (info) {
      JSON.parse(info).forEach((element) =>
        DeviceInfo.create({
          title: element.title,
          description: element.description,
          deviceId: device.id,
        }),
      );
    }

    return res.json(device);
  } catch (error) {
    next(AppError.badRequest(error.message));
  }
};

export const update = async (req, res, next) => {
  try {
    const { id, name, price, brandId, typeId, info, hit, sale, discount } = req.body;
    const { img } = req.files;
    img.mv(path.resolve(__dirname, '..', 'static', img.name));

    const salePrice = Math.round(price - (price / 100) * discount);

    const device = await Device.update(
      {
        name: name,
        price: salePrice,
        brandId: brandId,
        typeId: typeId,
        hit: hit,
        sale: sale,
        discount: discount,
        img: img.name,
      },
      {
        where: { id },
      },
    );

    if (info) {
      await DeviceInfo.destroy({
        where: {
          deviceId: id,
        },
      });

      JSON.parse(info).forEach((element) => {
        DeviceInfo.create({
          deviceId: id,
          title: element.title,
          description: element.description,
        });
      });
    }

    res.json(device);
  } catch (error) {
    next(AppError.badRequest(error.message));
  }
};

export const getAllHit = async (req, res) => {
  let devices = await Device.findAll({
    where: { hit: true },
  });

  res.json(devices);
};

export const getAllSale = async (req, res) => {
  let devices = await Device.findAll({
    where: { sale: true },
  });

  res.json(devices);
};

export const getAll = async (req, res) => {
  const { brandId, typeId, str } = req.query,
    page = req.query.page || 1,
    limit = req.query.limit || 9;

  const parseBrandId = brandId.split(',');
  const parseTypeId = typeId.split(',');

  let offset = page * limit - limit;
  let devices;

  if (str && !brandId && !typeId) {
    const findDevices = await Device.findAll({
      where: {
        name: {
          [Op.substring]: str,
        },
      },
    });

    res.json(findDevices);
  }

  if (!brandId && !typeId) {
    devices = await Device.findAndCountAll({ limit, offset });
  }

  if (brandId && !typeId) {
    devices = await Device.findAndCountAll({
      where: { brandId: parseBrandId },
      limit,
      offset,
    });
  }

  if (!brandId && typeId) {
    devices = await Device.findAndCountAll({
      where: { typeId: parseTypeId },
      limit,
      offset,
    });
  }

  if (brandId && typeId) {
    devices = await Device.findAndCountAll({
      where: {
        typeId: parseTypeId,
        brandId: parseBrandId,
      },
      limit,
      offset,
    });
  }

  res.json(devices);
};

export const getOne = async (req, res) => {
  const { id } = req.params;
  const device = await Device.findOne({
    where: { id },
    include: [
      { model: DeviceInfo, as: 'info' },
      { model: Reviews, as: 'reviews' },
    ],
  });
  res.json(device);
};

export const getAllReviews = async (req, res) => {
  const data = await Reviews.findAll({ limit: 5 });

  return res.json(data).status(200);
};

export const deleteOne = async (req, res) => {
  const { id } = req.params;

  await Device.destroy({
    where: { id },
  });

  res.status(200);
};
