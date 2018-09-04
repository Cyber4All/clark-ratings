export function enforceEmailVerification(req, res, next) {
  let user = req.user;
  if(user.emailVerified) {
    next();
  } else {
    res.status(401).send('Invalid Email Verification');
  }
}
