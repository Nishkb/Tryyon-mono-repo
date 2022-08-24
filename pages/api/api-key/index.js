import async from 'async';

import { searchAPIKey } from '../../../prisma/api-key/api-key';
import handleResponse from '../../../utils/helpers/handleResponse';
import runMiddleware from '../../../utils/helpers/runMiddleware';
import auth from '../../../utils/middlewares/auth';

const handler = async (req, res) => {
    await runMiddleware(req, res, auth);

    if (req.method == 'GET') {
        async.auto(
            {
                read: [
                    async () => {
                        if (req.admin) {
                            const apiKeys = await searchAPIKey(req.query);

                            if (apiKeys.length != 0)
                                return {
                                    message: 'API Keys found',
                                    apiKeys
                                };

                            throw new Error(
                                JSON.stringify({
                                    errorkey: 'read',
                                    body: {
                                        status: 404,
                                        data: {
                                            message: 'No API key found'
                                        }
                                    }
                                })
                            );
                        }

                        if (req.user) {
                            const apiKeys = await searchAPIKey({
                                ...req.query,
                                ownerId: req.user.id
                            });

                            if (apiKeys.length != 0)
                                return {
                                    message: 'API Keys found',
                                    apiKeys
                                };

                            throw new Error(
                                JSON.stringify({
                                    errorkey: 'read',
                                    body: {
                                        status: 404,
                                        data: {
                                            message: 'No API key found'
                                        }
                                    }
                                })
                            );
                        }
                    }
                ]
            },
            handleResponse(req, res, 'read')
        );
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
};

export default handler;
