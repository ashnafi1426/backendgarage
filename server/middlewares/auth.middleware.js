require('dotenv').config();
const jwt = require('jsonwebtoken');
function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;

  console.log("Auth Header Raw:", authHeader);

  if (!authHeader || typeof authHeader !== 'string') {
    return res.status(403).json({ status: 'fail', message: 'No token provided' });
  }

  const parts = authHeader.trim().split(' ');

  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ status: 'fail', message: 'Invalid token format' });
  }

  const token = parts[1];

  console.log("Token Extracted:", token);

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error("JWT Verify Error:", err);
      return res.status(401).json({ status: 'fail', message: 'Unauthorized' });
    }

    req.employee = decoded;
    next();
  });
}


function isAdmin(req, res, next) {
  const roleId = req.employee?.company_role_id;
  if (parseInt(roleId) === 3) return next();
  return res.status(403).json({ status: 'fail', message: 'Admin required' });
}

module.exports = { verifyToken, isAdmin };
