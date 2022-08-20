import async from 'async';

import handleResponse from '../../../utils/helpers/handleResponse';
import runMiddleware from '../../../utils/helpers/runMiddleware';
import auth from '../../../utils/middlewares/auth';
import { getCompany } from '../../../prisma/company/company';
import { getUser } from '../../../prisma/user/user';
import tmpAuth from '../../../utils/middlewares/temporaryAuth';

const handler = async (req, res) => {
    await runMiddleware(req, res, tmpAuth);
    if (!req.user)
        res.status(401).json({ message: 'Not applicable for admin' });
    else if (req.method == 'GET') {
        async.auto(
            {
                main: async () => {
                    const { id } = req.user;
                    const userCheck = await getUser({ id });
                    const progress = {};

                    if (userCheck.length == 0) {
                        throw new Error(
                            JSON.stringify({
                                errorkey: 'verification',
                                body: {
                                    status: 404,
                                    data: {
                                        message: 'User not found'
                                    }
                                }
                            })
                        );
                    }

                    progress.user = userCheck[0];

                    const company = await getCompany({
                        ownerId: userCheck[0].id
                    });

                    if (company.length != 0) {
                        progress.company = company;

                        if (company[0].tenant) {
                            progress.tenant = company[0].tenant;
                        }
                    }

                    return {
                        message: 'User progress',
                        progress
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
