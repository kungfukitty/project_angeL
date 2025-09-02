import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/env';
import User from '../models/User';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role?: string;
  };
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required',
        },
      });
    }
    
    const decoded = jwt.verify(token, config.jwtSecret) as any;
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({
        error: {
          code: 'UNAUTHORIZED',
          message: 'User not found',
        },
      });
    }
    
    req.user = {
      id: user._id.toString(),
      email: user.email,
      role: decoded.role,
    };
    
    next();
  } catch (error) {
    return res.status(401).json({
      error: {
        code: 'UNAUTHORIZED',
        message: 'Invalid token',
      },
    });
  }
};

/**
 * Middleware to ensure the current user is authenticated **and** has the `admin` role.
 *
 * This helper wraps the generic `authenticate` middleware and then performs
 * an additional role check. The previous implementation relied on the
 * implicit use of closures for `next` and would fall through even after
 * sending a response. By explicitly returning from the callback when
 * responding and returning the result of `next()` when the check passes,
 * we avoid inadvertently calling `next` after a response has been sent.
 */
export const authenticateAdmin = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // Delegate to the standard authentication middleware.  Passing our own
  // callback allows us to perform additional checks once the user has been
  // attached to the request object.  We do **not** call `next` here
  // directly; instead, the callback decides whether to proceed or return.
  await authenticate(req, res, async () => {
    // If there is no user or the role is not admin, immediately send a
    // forbidden response.  Returning here prevents execution from
    // continuing after the response has been sent.
    if (!req.user || req.user.role !== 'admin') {
      res.status(403).json({
        error: {
          code: 'FORBIDDEN',
          message: 'Admin access required',
        },
      });
      return;
    }
    // All checks passed; continue to the next handler in the chain.
    return next();
  });
};
