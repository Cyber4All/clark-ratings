// Set user as a global variable for authorization purposes 
export function isAuthor(req, res, next) {
    res.locals.user = req.user;
    next();
}
