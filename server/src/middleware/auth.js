import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const isAutherized = async (req, res, next) => {
  
  let token;

  // Check if token exists in Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Extract token from "Bearer TOKEN"
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from database (without password)
      req.user = await User.findById(decoded.id).select('-password');

      if(!req.user) {
        return res.status(401).json({
            message : "User not found"
        })
      }

      next();    // User authenticated, proceed to route

    } catch (error) {
      console.error('Token verification failed:', error.message);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};
