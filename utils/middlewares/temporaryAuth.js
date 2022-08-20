import jwt from 'jsonwebtoken';

// Checking if the user is an admin or an authenticated user and setting req.admin and/or req.user
const tmpAuth = (req, res, next) => {
    if (!req.headers['authorization']) {
        return res
            .status(403)
            .json({ message: 'A token is required for authentication' });
    }

    if (req.admin) delete req.admin;
    if (req.user) delete req.user;

    const token = req.headers['authorization'].replace('Bearer ', '');

    let isAuthenticatedUser = false,
        isAdmin = false;

    try {
        const decoded = jwt.verify(token, process.env.ADMIN_TOKEN_KEY);
        req.admin = decoded;
        isAdmin = true;
    } catch (err) {
        console.log('Not an admin user');
    }

    try {
        const decoded = jwt.verify(token, process.env.TOKEN_KEY);
        req.user = decoded;

        isAuthenticatedUser = true;
    } catch (err) {
        console.log('Not an authenticated user');
    }

    if (!isAdmin && !isAuthenticatedUser) {
        return res.status(401).json({ message: 'Unauthorized Access' });
    }

    return next();
};

export default tmpAuth;
