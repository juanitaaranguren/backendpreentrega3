
const isAdmin = (req, res, next) => {

    if (req.currentUser && req.currentUser.role === 'admin') {
      next();
    } else {
      res.status(403).json({ message: 'no tienes permisos' });
    }
  };
  
  const isUser = (req, res, next) => {
    if (req.currentUser && req.currentUser.role === 'user') {
      next();
    } else {
      res.status(403).json({ message: 'no tienes permisos' });
    }
  };
  
  module.exports = { isAdmin, isUser };
  