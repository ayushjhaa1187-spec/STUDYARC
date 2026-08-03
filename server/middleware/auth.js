import { z } from 'zod';

// Mock implementation of Supabase JWT verification
// In production, you would use @supabase/supabase-js or jsonwebtoken to verify the signature
export const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // Return a mock user for development since we don't have real Supabase tokens yet
    // In production: return res.status(401).json({ error: 'Unauthorized' });
    req.user = {
      id: 'mock-user-123',
      email: 'learner@example.com',
      role: 'learner'
    };
    return next();
  }

  const token = authHeader.split(' ')[1];
  try {
    // Dummy decode logic for development
    // E.g., if token is "dummy-mentor-token", set role to mentor
    let role = 'learner';
    if (token.includes('mentor')) role = 'mentor';
    if (token.includes('admin')) role = 'admin';

    req.user = {
      id: 'user-' + Math.random().toString(36).substr(2, 9),
      email: `${role}@example.com`,
      role: role
    };
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

export const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
    }
    next();
  };
};

export const validateBody = (schema) => {
  return (req, res, next) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Validation Error', details: error.errors });
      }
      next(error);
    }
  };
};

export const validateQuery = (schema) => {
  return (req, res, next) => {
    try {
      req.query = schema.parse(req.query);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Validation Error', details: error.errors });
      }
      next(error);
    }
  };
};
