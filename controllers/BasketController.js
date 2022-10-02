import { Basket, Device, DeviceInfo, Order, User } from '../models/models.js';
import { BasketDevice } from '../models/models.js';

export const add = async (req, res) => {
  try {
    const { deviceId, userId, decrement } = req.body;

    const basket = await Basket.findOne({ where: { userId } });
    console.log(basket.id, 'basket');
    console.log(deviceId, 'deviceId');

    const basketDevice = await BasketDevice.findOne({
      where: { deviceId: deviceId, basketId: basket.id },
    });

    if (decrement) {
      await basketDevice.decrement('count');
      return res.json('success');
    }
    if (basketDevice) {
      await basketDevice.increment('count');
    }

    if (!basketDevice) {
      await BasketDevice.create({ basketId: basket.id, deviceId, count: 1 });
    }

    return res.json('success');
  } catch (error) {
    console.log(error);
  }
};

export const getAll = async (req, res) => {
  try {
    const userId = req.params.id;

    const basket = await Basket.findOne({ where: { userId }, raw: true });

    const basketDevice = await BasketDevice.findAll({ where: { basketId: basket.id }, raw: true });

    const basketDeviceId = basketDevice.map((item) => (item = item.deviceId));

    const userBasket = await Device.findAll({
      where: { id: basketDeviceId },
      include: [{ model: BasketDevice, as: 'basketDevice', where: { basketId: basket.id } }],
    });

    return res.json(userBasket);
  } catch (error) {
    console.log(error);
  }
};

export const confirm = async (req, res) => {
  try {
    if (req.body.userId) {
      const userId = req.body.userId;

      const basket = await Basket.findOne({ where: { userId }, raw: true });

      const user = await User.findOne({ where: { id: userId }, raw: true });

      const basketDevice = await BasketDevice.findAll({
        where: { basketId: basket.id },
        raw: true,
      });

      if (basketDevice.length > 0) {
        const basketDeviceId = basketDevice.map((item) => (item = item.deviceId));

        await BasketDevice.destroy({ where: { deviceId: basketDeviceId } });

        basketDeviceId.map(async (item) => {
          await Order.create({ deviceId: item, email: user.email });
        });

        return res.json('success');
      } else {
        return res.json('Basket empty');
      }
    }

    if (!req.body.userId) {
      await req.body.guestBasket.map(async (item) => {
        await Order.create({ deviceId: item, email: req.body.email });
      });

      return res.json('success');
    } else {
      return res.json('Basket empty');
    }
  } catch (error) {
    console.log(error);
  }
};

export const remove = async (req, res) => {
  try {
    const userId = req.params.id.split('.')[0];
    const deviceId = req.params.id.split('.')[1];

    const basket = await Basket.findOne({ where: { userId }, raw: true });

    const basketId = basket.id;

    await BasketDevice.destroy({ where: { deviceId, basketId } });

    res.status(200).json('success');
  } catch (error) {
    console.log(error);
  }
};
