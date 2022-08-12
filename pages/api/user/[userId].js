import async from 'async';

import handleResponse from '../../../utils/helpers/handleResponse';
import runMiddleware from '../../../utils/helpers/runMiddleware';
import auth from '../../../utils/middlewares/auth';

import { getUser } from '../../../prisma/user/user';

const handler = async (req, res) => {
    await runMiddleware(req, res, auth);
    if (req.method == 'GET') {
        async.auto(
            {
                main: async () => {
                    const { userId } = req.query;

                    if (!req.admin && req.user.id != userId) {
                        throw new Error(
                            JSON.stringify({
                                errorkey: 'verification',
                                body: {
                                    status: 409,
                                    data: {
                                        message: 'Unauthorized access'
                                    }
                                }
                            })
                        );
                    }

                    const userCheck = await getUser({ id: userId });

                    if (userCheck.length == 0) {
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
                        message: 'User found',
                        user: userCheck[0]
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
