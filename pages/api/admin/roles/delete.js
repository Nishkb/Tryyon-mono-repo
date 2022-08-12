import Joi from 'joi';
import async from 'async';

import { deleteRole, checkRole } from '../../../../prisma/admin/roles';
import handleResponse from '../../../../utils/helpers/handleResponse';
import runMiddleware from '../../../../utils/helpers/runMiddleware';
import auth from '../../../../utils/middlewares/auth';
import validate from '../../../../utils/middlewares/validation';

const schema = {
    body: Joi.object({
        id: Joi.string().required()
    })
};

const handler = async (req, res) => {
    await runMiddleware(req, res, auth);
    if (!req.admin) res.status(401).json({ message: 'Unauthorized access' });
    else if (req.method == 'DELETE') {
        async.auto(
            {
                verify: async () => {
                    const { id } = req.body;
                    const roleCheck = await checkRole({ id });

                    if (roleCheck.length == 0) {
                        throw new Error(
                            JSON.stringify({
                                errorkey: 'verify',
                                body: {
                                    status: 404,
                                    data: {
                                        message: 'Role does not exist'
                                    }
                                }
                            })
                        );
                    }

                    return {
                        message: 'New Role Validated'
                    };
                },
                removeRole: [
                    'verify',
                    async () => {
                        const { id } = req.body;

                        const role = await deleteRole({ id });

                        if (role) {
                            return {
                                message: 'Role deleted',
                                role
                            };
                        }

                        throw new Error(
                            JSON.stringify({
                                errorKey: 'removeRole',
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
            handleResponse(req, res, 'removeRole')
        );
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
};

export default validate(schema, handler);
