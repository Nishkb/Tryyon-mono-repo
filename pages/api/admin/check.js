import async from 'async';

import handleResponse from '../../../utils/helpers/handleResponse';
import runMiddleware from '../../../utils/helpers/runMiddleware';
import auth from '../../../utils/middlewares/auth';

const handler = async (req, res) => {
    await runMiddleware(req, res, auth);
    if (!req.admin) res.status(401).json({ message: 'Unauthorized access' });
    else if (req.method == 'GET') {
        async.auto(
            {
                check: [
                    async () => ({
                        message: 'Admin Authenticated',
                        admin: req.admin
                    })
                ]
            },
            handleResponse(req, res, 'check')
        );
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
};

export default handler;
