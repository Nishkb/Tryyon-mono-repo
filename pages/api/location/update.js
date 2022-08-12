import Joi from 'joi';
import async from 'async';

import { prisma } from '../../../prisma/prisma';
import handleResponse from '../../../utils/helpers/handleResponse';
import validate from '../../../utils/middlewares/validation';
import auth from '../../../utils/middlewares/auth';
import runMiddleware from '../../../utils/helpers/runMiddleware';
import {
    searchLocations,
    updateLocation
} from '../../../prisma/location/location';

const schema = {
    body: Joi.object({
        id: Joi.string().required(),
        name: Joi.string().optional(),
        address: Joi.string().optional(),
        pincode: Joi.string().optional(),
        state: Joi.string().optional(),
        country: Joi.string().optional(),
        tenantId: Joi.string().optional()
    })
};

const handler = async (req, res) => {
    await runMiddleware(req, res, auth);
    if (req.method == 'POST') {
        async.auto(
            {
                verification: async () => {
                    const { id, tenantId, ...rest } = req.body;

                    if (!req.admin) {
                        // non admin user
                        const ownerId = req.user.id;
                        const locationCheck = await searchLocations({
                            id,
                            ownerId
                        });

                        if (locationCheck.length != 0) {
                            return {
                                message: 'Location validated',
                                id,
                                rest
                            };
                        }

                        throw new Error(
                            JSON.stringify({
                                errorKey: 'verification',
                                body: {
                                    status: 404,
                                    data: {
                                        message: 'Location not found'
                                    }
                                }
                            })
                        );
                    }

                    // for admin user
                    const locationCheck = await searchLocations({ id });

                    if (locationCheck.length == 0) {
                        throw new Error(
                            JSON.stringify({
                                errorKey: 'verification',
                                body: {
                                    status: 404,
                                    data: {
                                        message: 'Location not found'
                                    }
                                }
                            })
                        );
                    }

                    if (tenantId) {
                        const tenantCheck = await prisma.tenant.findMany({
                            where: {
                                id: tenantId
                            }
                        });

                        if (tenantCheck.length == 0) {
                            throw new Error(
                                JSON.stringify({
                                    errorKey: 'verification',
                                    body: {
                                        status: 404,
                                        data: {
                                            message: 'Tenant not found'
                                        }
                                    }
                                })
                            );
                        }

                        rest.tenantId = tenantId;
                    }

                    return {
                        message: 'Location validated',
                        id,
                        rest
                    };
                },
                update: [
                    'verification',
                    async (results) => {
                        const { id, rest } = results.verification;

                        const location = await updateLocation(id, rest);

                        if (location) {
                            return {
                                message: 'location updated',
                                location
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
