module.exports = (allowedRoles) => {
  return (req, res, next) => {
    console.log('🛡️ Role middleware check');
    console.log('🛡️ User role:', req.user?.role);
    console.log('🛡️ Allowed roles:', allowedRoles);
    
    if (!allowedRoles.includes(req.user.role)) {
      console.log('❌ Access denied - role not allowed');
      return res.status(403).json({
        message: "Access denied"
      });
    }
    
    console.log('✅ Role check passed');
    next();
  };
};
