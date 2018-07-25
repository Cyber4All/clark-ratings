import * as jwt from 'express-jwt';

export function generateServiceToken() {
    const payload = {
      SERVICE_KEY: process.env.SERVICE_KEY
    };
    const options = {
      issuer: process.env.ISSUER,
      expiresIn: 86400,
      audience: 'https://clark.center'
    };
    return jwt.sign(payload, process.env.KEY, options);
  }