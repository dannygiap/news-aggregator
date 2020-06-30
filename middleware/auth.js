const jwt = require('jsonwebtoken');
const config = require('config');

function auth(req, res, next) {
  const token = req.header('x-auth-token');

  if (!token) return res.status(401).json({ msg: 'no token, unautherized' });

  try {
    //verify token
    const decoded = jwt.verify(token, config.get('jwtSecret'));

    //add user to req
    req.user = decoded;
    next();
  } catch (e) {
    return res.status(401).json({ msg: 'invalid token' });
  }
}

module.exports = auth;
