import async from 'async';

import { getAssociation } from '../../../prisma/association/association';
import handleResponse from '../../../utils/helpers/handleResponse';
import runMiddleware from '../../../utils/helpers/runMiddleware';
import auth from '../../../utils/middlewares/auth';

const handler = async (req, res) => {
    await runMiddleware(req, res, auth);
    if (req.method == 'GET') {
        async.auto(
            {
                verify: async () => {
                    // if admin user is trying to search an Association
                    if (req.admin) {
                        const { associationId } = req.query;

                        const associationCheck = await getAssociation({
                            id: associationId
                        });

                        // if no association with given id found
                        if (associationCheck.length == 0) {
                            throw new Error(
                                JSON.stringify({
                                    errorkey: 'verify',
                                    body: {
                                        status: 409,
                                        data: {
                                            message:
                                                'Association with given id does not exist'
                                        }
                                    }
                                })
                            );
                        }

                        return {
                            message: 'Association validated',
                            association: associationCheck[0]
                        };
                    }

                    // if an authenticated user is trying to find an association
                    if (req.user) {
                        const userId = req.user.id;
                        const { associationId } = req.query;
                        const associationCheck = await getAssociation({
                            id: associationId
                        });

                        if (associationCheck.length != 0) {
                            if (associationCheck[0].userId == userId) {
                                return {
                                    message: 'Association validated',
                                    association: associationCheck[0]
                                };
                            }

                            throw new Error(
                                JSON.stringify({
                                    errorkey: 'verify',
                                    body: {
                                        status: 409,
                                        data: {
                                            message:
                                                'User is not the owner of the association'
                                        }
                                    }
                                })
                            );
                        }

                        throw new Error(
                            JSON.stringify({
                                errorkey: 'verify',
                                body: {
                                    status: 404,
                                    data: {
                                        message: 'Association not found'
                                    }
                                }
                            })
                        );
                    }
                },
                read: [
                    'verify',
                    async (results) => {
                        const { association } = results.verify;

                        if (association)
                            return {
                                message: 'Association found',
                                association
                            };

                        throw new Error(
                            JSON.stringify({
                                errorkey: 'read',
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
            handleResponse(req, res, 'read')
        );
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
};

export default handler;
