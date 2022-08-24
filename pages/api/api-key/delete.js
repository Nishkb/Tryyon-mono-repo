import async from 'async';
import Joi from 'joi';

import { getAPIKey, deleteAPIKey } from '../../../prisma/api-key/api-key';
import { prisma } from '../../../prisma/prisma';
import handleResponse from '../../../utils/helpers/handleResponse';
import runMiddleware from '../../../utils/helpers/runMiddleware';
import auth from '../../../utils/middlewares/auth';
import validate from '../../../utils/middlewares/validation';

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
                verify: async () => {
                    // if admin user is trying to make a new apiKey
                    if (req.admin) {
                        const { id } = req.body;

                        const apiKeyCheck = await getAPIKey({ id });

                        // if no apiKey with given id found
                        if (apiKeyCheck.length == 0) {
                            throw new Error(
                                JSON.stringify({
                                    errorkey: 'verify',
                                    body: {
                                        status: 409,
                                        data: {
                                            message:
                                                'apiKey with given id does not exist'
                                        }
                                    }
                                })
                            );
                        }

                        return {
                            message: 'apiKey validated'
                        };
                    }

                    // if an authenticated user is trying to create an apiKey
                    if (req.user) {
                        const ownerId = req.user.id;
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
                                                'User is not the owner of the apiKey'
                                        }
                                    }
                                })
                            );
                        }

                        return {
                            message: 'apiKey validated'
                        };
                    }
                },
                delete: [
                    'verify',
                    async () => {
                        const { id } = req.body;
                        const deletedAPIKey = await deleteAPIKey(id);

                        if (deletedAPIKey)
                            return {
                                message: 'apiKey deleted',
                                deletedAPIKey
                            };

                        throw new Error(
                            JSON.stringify({
                                errorkey: 'delete',
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
            handleResponse(req, res, 'delete')
        );
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
};

export default validate(schema, handler);
