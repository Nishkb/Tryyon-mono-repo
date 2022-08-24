import async from 'async';
import Joi from 'joi';

import { getAPIKey, updateAPIKey } from '../../../prisma/api-key/api-key';
import { prisma } from '../../../prisma/prisma';
import handleResponse from '../../../utils/helpers/handleResponse';
import runMiddleware from '../../../utils/helpers/runMiddleware';
import auth from '../../../utils/middlewares/auth';
import validate from '../../../utils/middlewares/validation';

const schema = {
    body: Joi.object({
        id: Joi.string().required(),
        status: Joi.boolean().optional()
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
                        const { id } = req.body;

                        const apiKeyCheck = await getAPIKey({ id });

                        if (apiKeyCheck.length == 0) {
                            throw new Error(
                                JSON.stringify({
                                    errorkey: 'verify',
                                    body: {
                                        status: 404,
                                        data: {
                                            message: 'API Key not found'
                                        }
                                    }
                                })
                            );
                        }

                        return {
                            message: 'API Key validated'
                        };
                    }

                    // if an authenticated user is trying to create an association
                    if (req.user) {
                        const ownerId = req.user.id; // userId is not needed to be there in body
                        const { id } = req.body;

                        const apiKeyCheck = await prisma.apiKey.findMany({
                            where: {
                                id,
                                tenant: {
                                    company: {
                                        ownerId
                                    }
                                }
                            }
                        });

                        if (apiKeyCheck.length == 0) {
                            throw new Error(
                                JSON.stringify({
                                    errorkey: 'verify',
                                    body: {
                                        status: 409,
                                        data: {
                                            message:
                                                'User is not the owner of the API key'
                                        }
                                    }
                                })
                            );
                        }

                        return {
                            message: 'API Key validated'
                        };
                    }
                },
                update: [
                    'verify',
                    async () => {
                        const { id, ...rest } = req.body;

                        const updatedAPIKey = await updateAPIKey(id, rest);

                        if (updatedAPIKey)
                            return {
                                message: 'API Key updated',
                                updatedAPIKey
                            };

                        throw new Error(
                            JSON.stringify({
                                errorkey: 'update',
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
            handleResponse(req, res, 'update')
        );
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
};

export default validate(schema, handler);
