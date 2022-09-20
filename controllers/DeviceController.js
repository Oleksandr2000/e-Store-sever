import { v4 } from 'uuid';
import path from 'path';
import { Device, DeviceInfo } from '../models/models.js';
import { AppError } from '../error/AppError.js';
import commonjsVariables from 'commonjs-variables-for-esmodules';

const { __dirname } = commonjsVariables(import.meta);

export const create = async (req, res, next) => {
  try {
    const { name, price, brandId, typeId, info, hit, sale, discount } = req.body;
    const { img } = req.files;
    let fileName = v4() + '.jpg';
    img.mv(path.resolve(__dirname, '..', 'static', fileName));
    const device = await Device.create({
      name: name,
      price: price,
      brandId: brandId,
      typeId: typeId,
      hit: hit ? hit : false,
      sale: sale ? sale : false,
      discount: discount,
      img: fileName,
    });

    console.log(info);

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

export const getAllHit = async (req, res) => {
  let devices = await Device.findAll({
    where: { hit: true },
  });

  return res.json(devices);
};

export const getAllSale = async (req, res) => {
  let devices = await Device.findAll({
    where: { sale: true },
  });

  return res.json(devices);
};

export const getAll = async (req, res) => {
  const { brandId, typeId } = req.query,
    page = req.query.page || 1,
    limit = req.query.limit || 9;

  const parseBrandId = brandId.split(',');
  const parseTypeId = typeId.split(',');

  let offset = page * limit - limit;
  let devices;
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

  return res.json(devices);
};

export const getOne = async (req, res) => {
  const { id } = req.params;
  const device = await Device.findOne({
    where: { id },
    include: [{ model: DeviceInfo, as: 'info' }],
  });
  return res.json(device);
};
