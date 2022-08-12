import Joi from 'joi';
import async from 'async';

import { updateTenant, getTenant } from '../../../prisma/tenant/tenant';
import { prisma } from '../../../prisma/prisma';
import handleResponse from '../../../utils/helpers/handleResponse';
import validate from '../../../utils/middlewares/validation';
import auth from '../../../utils/middlewares/auth';
import runMiddleware from '../../../utils/helpers/runMiddleware';

const schema = {
    body: Joi.object({
        id: Joi.string().optional(),
        name: Joi.string().optional(),
        description: Joi.string().optional()
    })
};

const handler = async (req, res) => {
    await runMiddleware(req, res, auth);
    if (req.method == 'POST') {
        async.auto(
            {
                verification: async () => {
                    if (!req.admin) {
                        // non admin user
                        const ownerId = req.user.id;
                        const tenant = await prisma.tenant.findMany({
                            where: {
                                company: {
                                    ownerId
                                }
                            }
                        });

                        if (tenant.length != 0) {
                            return {
                                message: 'Tenant found',
                                tenant: tenant[0]
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

                    // admin user
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
                update: [
                    'verification',
                    async (results) => {
                        const { body } = req;
                        if (body.id) delete body.id;

                        const { id } = results.verification.tenant;

                        const tenant = await updateTenant(id, body);

                        if (tenant) {
                            return {
                                message: 'Tenant updated',
                                tenant
                            };
                        }

                        throw new Error(
                            JSON.stringify({
                                errorKey: 'update',
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
            handleResponse(req, res, 'update')
        );
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
};

export default validate(schema, handler);
