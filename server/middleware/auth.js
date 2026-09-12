import { db } from '../db/db.js';

/**
 * Authentication Middleware
 * Validates 'Authorization: Bearer <token>' header and attaches user to req.user.
 */
export function authenticate(req, res, next) {
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Access denied: No token provided in Authorization header',
    });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied: Malformed Authorization header',
    });
  }

  // Token format: hms_jwt_token_<userId>_<timestamp>
  let userId = null;
  if (token.startsWith('hms_jwt_token_')) {
    const withoutPrefix = token.replace('hms_jwt_token_', '');
    const lastUnderscore = withoutPrefix.lastIndexOf('_');
    if (lastUnderscore !== -1) {
      userId = withoutPrefix.substring(0, lastUnderscore);
    } else {
      userId = withoutPrefix;
    }
  } else {
    userId = token;
  }

  const user = db.users.findById(userId) || db.users.findOne((u) => u.id === userId);

  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Access denied: Invalid or expired token',
    });
  }

  req.user = user;
  next();
}

export default authenticate;
