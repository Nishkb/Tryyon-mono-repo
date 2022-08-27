// import jwt from 'jsonwebtoken';

// Checking if the user is an authenticated customer
const uidAuth = (req, res, next) => {
    if (!req.headers['authorization']) {
        return res
            .status(403)
            .json({ message: 'A token is required for authentication' });
    }

    if (req.uid) delete req.uid;

    const token = req.headers['authorization'].replace('Bearer ', '');

    try {
        const decoded = token; // logic for decoding to be added
        req.uid = decoded;
    } catch (err) {
        console.log('Not an authenticated customer');
        return res.status(401).json({ message: 'Unauthorized Access' });
    }

    return next();
};

export default uidAuth;
