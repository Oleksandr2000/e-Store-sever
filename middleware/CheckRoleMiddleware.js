import jwt from 'jsonwebtoken';

export function chaeckRole(role) {
  return function (req, res, next) {
    if (req.method === 'OPTIONS') {
      next();
    }
    try {
      const token = req.headers.authorization.split(' ')[1]; // Bearer asfasnfkajsfnjk
      if (!token) {
        return res.status(401).json({ message: 'No login' });
      }
      const decoded = jwt.verify(token, 'SECRET_KEY');
      if (decoded.role !== role) {
        return res.status(403).json({ message: 'access is denied' });
      }
      req.user = decoded;
      next();
    } catch (e) {
      res.status(401).json({ message: 'Не авторизован' });
    }
  };
}
