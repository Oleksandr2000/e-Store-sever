import { Reviews } from '../models/models.js';

export const create = async (req, res) => {
  try {
    const { text, author, deviceId } = req.body;

    await Reviews.create({
      text: text,
      author: author,
      deviceId: deviceId,
    });

    return res.json('success');
  } catch (error) {
    next(AppError.badRequest(error.message));
  }
};
