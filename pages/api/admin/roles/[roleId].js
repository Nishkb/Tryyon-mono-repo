import async from 'async';

import { checkRole } from '../../../../prisma/admin/roles';
import handleResponse from '../../../../utils/helpers/handleResponse';
import runMiddleware from '../../../../utils/helpers/runMiddleware';
import auth from '../../../../utils/middlewares/auth';

const handler = async (req, res) => {
    await runMiddleware(req, res, auth);
    if (!req.admin) res.status(401).json({ message: 'Unauthorized access' });
    else if (req.method == 'GET') {
        async.auto(
            {
                main: [
                    async () => {
                        const { roleId } = req.query;
                        const role = await checkRole({ id: roleId });

                        if (role.length != 0) {
                            return {
                                message: 'Role found',
                                role: role[0]
                            };
                        }

                        throw new Error(
                            JSON.stringify({
                                errorKey: 'main',
                                body: {
                                    status: 404,
                                    data: {
                                        message: 'No such Role found'
                                    }
                                }
                            })
                        );
                    }
                ]
            },
            handleResponse(req, res, 'main')
        );
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
};

export default handler;
