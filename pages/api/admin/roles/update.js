import Joi from 'joi';
import async from 'async';

import { updateRole, checkRole } from '../../../../prisma/admin/roles';
import handleResponse from '../../../../utils/helpers/handleResponse';
import runMiddleware from '../../../../utils/helpers/runMiddleware';
import auth from '../../../../utils/middlewares/auth';
import validate from '../../../../utils/middlewares/validation';

const schema = {
    body: Joi.object({
        id: Joi.string().required(),
        updateData: Joi.object({
            title: Joi.string().optional(),
            adminRoles: Joi.array()
                .items(
                    Joi.object({
                        module: Joi.string().required(),
                        read: Joi.boolean().required(),
                        write: Joi.boolean().required(),
                        edit: Joi.boolean().required(),
                        delete: Joi.boolean().required()
                    })
                )
                .optional(),
            tenantRoles: Joi.array()
                .items(
                    Joi.object({
                        module: Joi.string().required(),
                        read: Joi.boolean().required(),
                        write: Joi.boolean().required(),
                        edit: Joi.boolean().required(),
                        delete: Joi.boolean().required()
                    })
                )
                .optional()
        })
    })
};

const handler = async (req, res) => {
    await runMiddleware(req, res, auth);
    if (!req.admin) res.status(401).json({ message: 'Unauthorized access' });
    else if (req.method == 'POST') {
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
                                        message: 'Invalid Role ID'
                                    }
                                }
                            })
                        );
                    }

                    return {
                        message: 'New Role Validated'
                    };
                },
                updateRole: [
                    'verify',
                    async () => {
                        const { id, updateData } = req.body;

                        const { title } = updateData;

                        if (title) {
                            const roleCheck = await checkRole({ title });

                            if (roleCheck.length != 0) {
                                throw new Error(
                                    JSON.stringify({
                                        errorkey: 'verify',
                                        body: {
                                            status: 409,
                                            data: {
                                                message:
                                                    'Role with that title already exists'
                                            }
                                        }
                                    })
                                );
                            }
                        }

                        const role = await updateRole(id, updateData);

                        if (role) {
                            return {
                                message: 'Role updated',
                                role
                            };
                        }

                        throw new Error(
                            JSON.stringify({
                                errorKey: 'updateRole',
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
            handleResponse(req, res, 'updateRole')
        );
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
};

export default validate(schema, handler);
