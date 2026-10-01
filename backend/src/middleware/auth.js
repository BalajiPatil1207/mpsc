const { verifyToken } = require('../helper/authHelper');
const { handle401 } = require('../helper/errorHandler');

const requireAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return handle401(res, 'Authentication token missing');
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return handle401(res, 'Invalid or expired token');
  }

  req.user = decoded; // { id, email }
  next();
};

module.exports = requireAuth;
