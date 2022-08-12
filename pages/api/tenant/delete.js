import Joi from 'joi';
import async from 'async';

import { deleteTenant, getTenant } from '../../../prisma/tenant/tenant';
import { prisma } from '../../../prisma/prisma';
import handleResponse from '../../../utils/helpers/handleResponse';
import validate from '../../../utils/middlewares/validation';
import auth from '../../../utils/middlewares/auth';
import runMiddleware from '../../../utils/helpers/runMiddleware';

const schema = {
    body: Joi.object({
        id: Joi.string().optional()
    })
};

const handler = async (req, res) => {
    await runMiddleware(req, res, auth);
    if (req.method == 'DELETE') {
        async.auto(
            {
                verification: async () => {
                    if (!req.admin) {
                        // if a non admin user is trying to delete
                        const ownerId = req.user.id;
                        const tenantCheck = await prisma.tenant.findMany({
                            where: {
                                company: {
                                    ownerId
                                }
                            }
                        });

                        if (tenantCheck.length != 0) {
                            return {
                                message: 'Tenant found',
                                tenant: tenantCheck[0]
                            };
                        }

                        throw new Error(
                            JSON.stringify({
                                errorkey: 'verification',
                                body: {
                                    status: 404,
                                    data: {
                                        message: 'User does not have a tenant'
                                    }
                                }
                            })
                        );
                    }

                    // if an admin is trying to delete
                    const { id } = req.body;

                    if (!id) {
                        throw new Error(
                            JSON.stringify({
                                errorkey: 'verification',
                                body: {
                                    status: 409,
                                    data: {
                                        message: 'Tenant ID not provided'
                                    }
                                }
                            })
                        );
                    }

                    const tenantCheck = await getTenant({ id });

                    if (tenantCheck.length == 0) {
                        throw new Error(
                            JSON.stringify({
                                errorkey: 'verification',
                                body: {
                                    status: 404,
                                    data: {
                                        message: 'No such tenant found'
                                    }
                                }
                            })
                        );
                    }

                    return {
                        message: 'Tenant found',
                        tenant: tenantCheck[0]
                    };
                },
                delete: [
                    'verification',
                    async (results) => {
                        const { id } = results.verification.tenant;

                        const res = await deleteTenant(id);

                        if (res) {
                            return {
                                message: 'Tenant deleted',
                                tenant: res
                            };
                        }

                        throw new Error(
                            JSON.stringify({
                                errorKey: 'delete',
                                body: {
                                    status: 500,
                                    data: {
                                        message: 'Internal server error'
                                    }
                                }
                            })
                        );
                    }
                ]
            },
            handleResponse(req, res, 'delete')
        );
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
};

export default validate(schema, handler);
