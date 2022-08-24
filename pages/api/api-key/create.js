import async from 'async';
import Joi from 'joi';

import { createAPIKey } from '../../../prisma/api-key/api-key';
import { prisma } from '../../../prisma/prisma';
import handleResponse from '../../../utils/helpers/handleResponse';
import runMiddleware from '../../../utils/helpers/runMiddleware';
import auth from '../../../utils/middlewares/auth';
import validate from '../../../utils/middlewares/validation';
import { uuid } from 'uuidv4';

const schema = {
    body: Joi.object({
        tenantId: Joi.string().optional(),
        status: Joi.boolean().default(true),
        validTill: Joi.date().iso().optional()
    })
};

const handler = async (req, res) => {
    await runMiddleware(req, res, auth);

    if (req.method == 'POST') {
        async.auto(
            {
                verify: async () => {
                    // if admin user is trying to make a new Association
                    if (req.admin) {
                        const { tenantId } = req.body;

                        if (!tenantId) {
                            throw new Error(
                                JSON.stringify({
                                    errorkey: 'verify',
                                    body: {
                                        status: 409,
                                        data: {
                                            message: 'tenantId not provided'
                                        }
                                    }
                                })
                            );
                        }

                        const tenant = await prisma.tenant.findMany({
                            where: {
                                id: tenantId
                            }
                        });

                        if (tenant.length == 0) {
                            throw new Error(
                                JSON.stringify({
                                    errorkey: 'verify',
                                    body: {
                                        status: 404,
                                        data: {
                                            message: 'Tenant not found'
                                        }
                                    }
                                })
                            );
                        }
                    }

                    // if an authenticated user is trying to create an association
                    if (req.user) {
                        const { id } = req.user; // userId is not needed to be there in body

                        const tenant = await prisma.tenant.findMany({
                            where: {
                                company: {
                                    ownerId: id
                                }
                            }
                        });

                        if (tenant.length == 0) {
                            throw new Error(
                                JSON.stringify({
                                    errorkey: 'verify',
                                    body: {
                                        status: 409,
                                        data: {
                                            message:
                                                'User does not have a tenant'
                                        }
                                    }
                                })
                            );
                        }

                        req.body.tenantId = tenant[0].id;
                    }

                    return {
                        message: 'API Key validated'
                    };
                },
                create: [
                    'verify',
                    async () => {
                        const { body } = req;
                        body.APIKey = uuid();
                        const createdAPIKey = await createAPIKey(body);

                        if (createdAPIKey)
                            return {
                                message: 'New API Key Created',
                                createdAPIKey
                            };

                        throw new Error(
                            JSON.stringify({
                                errorkey: 'create',
                                body: {
                                    status: 500,
                                    data: {
                                        message: 'Internal Server Error'
                                    }
                                }
                            })
                        );
                    }
                ]
            },
            handleResponse(req, res, 'create')
        );
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
};

export default validate(schema, handler);
