// middleware.js
const jwt = require('jsonwebtoken');

const authenticateUser = (req, res, next) => {
  // Your authentication logic goes here
  // Check if the request header contains a valid JWT token
  const token = req.header('x-auth-token');

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized - No token provided' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, /* your secret key */ 'yourSecretKey');

    // Attach the user object to the request for further use in the route handler
    req.user = decoded.user;

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized - Invalid token' });
  }
};

module.exports = { authenticateUser };
