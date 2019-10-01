import * as jwt from 'jsonwebtoken';
import { UserToken } from '../types/UserToken';

export function generateUserToken(user: UserToken) {
    const payload = {
      username: user.username,
      name: user.name,
      email: user.email,
      organization: user.organization,
      emailVerified: user.emailVerified,
      accessGroups: user.accessGroups,
    };
    const options = {
      issuer: process.env.ISSUER,
      expiresIn: 86400,
      audience: 'https://clark.center',
    };
    return jwt.sign(payload, process.env.KEY, options);
  }
