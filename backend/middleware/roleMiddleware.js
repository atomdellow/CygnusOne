const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: Insufficient permissions'
      });
    }
    next();
  };
};

module.exports = { authorize };
