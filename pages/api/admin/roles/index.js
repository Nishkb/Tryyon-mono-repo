import async from 'async';

import { getRoles } from '../../../../prisma/admin/roles';
import handleResponse from '../../../../utils/helpers/handleResponse';
import runMiddleware from '../../../../utils/helpers/runMiddleware';
import auth from '../../../../utils/middlewares/auth';

const handler = async (req, res) => {
    await runMiddleware(req, res, auth);
    if (!req.admin) res.status(401).json({ message: 'Unauthorized access' });
    else if (req.method == 'GET') {
        async.auto(
            {
                read: [
                    async () => {
                        const roles = await getRoles();

                        if (roles) {
                            return {
                                message: 'Roles found',
                                roles
                            };
                        }

                        throw new Error(
                            JSON.stringify({
                                errorKey: 'read',
                                body: {
                                    status: 404,
                                    data: {
                                        message: 'No Role found'
                                    }
                                }
                            })
                        );
                    }
                ]
            },
            handleResponse(req, res, 'read')
        );
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
};

export default handler;
