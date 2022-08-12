import async from 'async';
import Joi from 'joi';

import { prisma } from '../../../prisma/prisma';
import { createLocation } from '../../../prisma/location/location';
import handleResponse from '../../../utils/helpers/handleResponse';
import validate from '../../../utils/middlewares/validation';
import auth from '../../../utils/middlewares/auth';
import runMiddleware from '../../../utils/helpers/runMiddleware';

const schema = {
    body: Joi.object({
        name: Joi.string().required(),
        address: Joi.string().required(),
        pincode: Joi.string().required(),
        state: Joi.string().required(),
        country: Joi.string().required(),
        tenantId: Joi.string().optional()
    })
};

const handler = async (req, res) => {
    await runMiddleware(req, res, auth);
    if (req.method == 'POST') {
        async.auto(
            {
                verification: async () => {
                    if (!req.admin) {
                        const { id } = req.user;

                        const tenantCheck = await prisma.tenant.findMany({
                            where: {
                                company: {
                                    ownerId: id
                                }
                            }
                        });

                        if (tenantCheck.length == 0) {
                            throw new Error(
                                JSON.stringify({
                                    errorkey: 'verification',
                                    body: {
                                        status: 404,
                                        data: {
                                            message:
                                                'User does not have a tenant'
                                        }
                                    }
                                })
                            );
                        }

                        return {
                            message: 'Tenant validated',
                            tenantId: tenantCheck[0].id
                        };
                    }

                    const { tenantId } = req.body;

                    if (!tenantId) {
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

                    const tenantCheck = await prisma.tenant.findMany({
                        where: {
                            id: tenantId
                        }
                    });

                    if (tenantCheck.length == 0) {
                        throw new Error(
                            JSON.stringify({
                                errorkey: 'verification',
                                body: {
                                    status: 404,
                                    data: {
                                        message:
                                            'Tenant with given ID does not exist'
                                    }
                                }
                            })
                        );
                    }

                    return {
                        message: 'Tenant validated',
                        tenantId
                    };
                },
                create: [
                    'verification',
                    async (results) => {
                        const { body } = req;
                        body.tenantId = results.verification.tenantId;

                        const res = await createLocation(body);

                        if (res) {
                            return {
                                message: 'New Location Created',
                                location: res
                            };
                        }

                        throw new Error(
                            JSON.stringify({
                                errorKey: 'create',
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
