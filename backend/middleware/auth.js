/* Author: Xinyi */
const jwt = require('jsonwebtoken');

/**
 * Authentication / authorization middleware.
 *
 * iSpent uses stateless JWT auth: the token itself carries the user id
 * and role, so no server-side session store is needed. requireAuth is
 * the gate every business route sits behind; requireAdmin is layered on
 * top of it for the admin-only routes.
 */

// Verifies the Bearer token and, on success, attaches { id, role } to
// req.user so downstream handlers can scope queries by owner and check
// the role without re-decoding the token.
function requireAuth(req, res, next) {
  const header = req.headers.authorization;

  // Reject early if there is no "Bearer <token>" header at all, so
  // jwt.verify is never called with undefined.
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const token = header.slice(7); // strip the "Bearer " prefix
  try {
    // Throws if the signature is invalid or the token has expired.
    // JWT_SECRET is read from the environment — never hardcoded.
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: payload.id, role: payload.role };
    next();
  } catch {
    // One generic message for both "tampered" and "expired" on purpose:
    // we don't leak which one failed to a potential attacker.
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

// Role gate for admin-only routes. Must run AFTER requireAuth, because it
// relies on req.user.role being populated. Returns 403 (authenticated
// but not allowed) rather than 401 (not authenticated).
function requireAdmin(req, res, next) {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
}

module.exports = { requireAuth, requireAdmin };
