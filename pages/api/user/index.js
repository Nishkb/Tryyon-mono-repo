import async from 'async';

import handleResponse from '../../../utils/helpers/handleResponse';
import runMiddleware from '../../../utils/helpers/runMiddleware';
import auth from '../../../utils/middlewares/auth';

import { searchUser } from '../../../prisma/user/user';

const handler = async (req, res) => {
    await runMiddleware(req, res, auth);
    if (!req.admin) res.status(401).json({ message: 'Unauthorized access' });
    else if (req.method == 'GET') {
        async.auto(
            {
                main: async () => {
                    const users = await searchUser(req.query);

                    if (users.length == 0) {
                        throw new Error(
                            JSON.stringify({
                                errorkey: 'verification',
                                body: {
                                    status: 404,
                                    data: {
                                        message: 'No such user found'
                                    }
                                }
                            })
                        );
                    }

                    return {
                        message: 'Users found',
                        users
                    };
                }
            },
            handleResponse(req, res, 'main')
        );
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
};

export default handler;
