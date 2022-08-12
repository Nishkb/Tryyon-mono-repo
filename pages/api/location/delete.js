import Joi from 'joi';
import async from 'async';

import { deleteLocation } from '../../../prisma/location/location';
import { prisma } from '../../../prisma/prisma';
import handleResponse from '../../../utils/helpers/handleResponse';
import validate from '../../../utils/middlewares/validation';
import auth from '../../../utils/middlewares/auth';
import runMiddleware from '../../../utils/helpers/runMiddleware';

const schema = {
    body: Joi.object({
        id: Joi.string().required()
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
                        const { id } = req.body;
                        const locationCheck = await prisma.location.findMany({
                            where: {
                                id,
                                tenant: {
                                    company: {
                                        ownerId
                                    }
                                }
                            }
                        });

                        if (locationCheck.length != 0) {
                            return {
                                message: 'Location validated'
                            };
                        }

                        throw new Error(
                            JSON.stringify({
                                errorkey: 'verification',
                                body: {
                                    status: 404,
                                    data: {
                                        message: 'Location not found'
                                    }
                                }
                            })
                        );
                    }

                    // if an admin is trying to delete
                    const { id } = req.body;

                    const locationCheck = await prisma.location.findMany({
                        where: {
                            id
                        }
                    });

                    if (locationCheck.length == 0) {
                        throw new Error(
                            JSON.stringify({
                                errorkey: 'verification',
                                body: {
                                    status: 404,
                                    data: {
                                        message: 'Location not found'
                                    }
                                }
                            })
                        );
                    }

                    return {
                        message: 'Location found'
                    };
                },
                delete: [
                    'verification',
                    async () => {
                        const { id } = req.body;

                        const res = await deleteLocation(id);

                        if (res) {
                            return {
                                message: 'Location deleted',
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
