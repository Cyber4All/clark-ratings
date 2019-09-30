import { Request, Response, NextFunction } from 'express';

export function enforceEmailVerification(req: Request, res: Response, next: NextFunction) {
  let user = req.user;
  if (user.emailVerified) {
    next();
  } else {
    res.status(401).send('Invalid Email Verification');
  }
}
