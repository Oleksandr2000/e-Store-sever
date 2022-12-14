import jwt from 'jsonwebtoken';

export function AuthMiddleware(req, res, next) {
  if (req.method === 'OPTIONS') {
    next();
  }
  try {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No login' });
    }
    const decoded = jwt.verify(token, 'SECRET_KEY');
    req.user = decoded;
    next();
  } catch (e) {
    res.status(401).json({ message: 'No login' });
  }
}
