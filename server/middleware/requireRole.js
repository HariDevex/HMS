/**
 * Role Authorization Middleware
 * Verifies that req.user has one of the required roles.
 * Returns 403 if unauthorized.
 * 
 * @param {string|string[]} allowedRoles - Role or array of roles allowed to access the endpoint
 */
export function requireRole(allowedRoles = []) {
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required before checking role permissions',
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Role '${req.user.role}' is not authorized to access this resource. Required: ${roles.join(', ')}`,
      });
    }

    next();
  };
}

export default requireRole;
