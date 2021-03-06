import * as jwt from 'jsonwebtoken';

export function enforceAdminAccess(req: any, res: any, next: any) {
  let user = req.user;
  const cookie = req.cookies.presence;
  if (!user && cookie) {
    user = jwt.decode(cookie);
  }
  if (user && user.accessGroups && user.accessGroups.includes('admin')) {
    next();
  } else {
    res.status(401).send('Invalid access!');
  }
}


