import async from 'async';
import Joi from 'joi';

import handleResponse from '../../../utils/helpers/handleResponse';
import runMiddleware from '../../../utils/helpers/runMiddleware';
import auth from '../../../utils/middlewares/auth';
import validate from '../../../utils/middlewares/validation';

import { deleteUser, getUser } from '../../../prisma/user/user';

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
                    if (req.admin) {
                        // admin user
                        const { id } = req.body;

                        if (!id) {
                            throw new Error(
                                JSON.stringify({
                                    errorkey: 'verification',
                                    body: {
                                        status: 409,
                                        data: {
                                            message: 'User ID not provided'
                                        }
                                    }
                                })
                            );
                        }

                        const userCheck = await getUser({ id });

                        if (userCheck.length == 0) {
                            throw new Error(
                                JSON.stringify({
                                    errorkey: 'verification',
                                    body: {
                                        status: 404,
                                        data: {
                                            message: 'No such user found'
                                        }
                                    }
                                })
                            );
                        }

                        return {
                            message: 'User Validated',
                            id
                        };
                    }

                    // non admin user
                    const { id } = req.user;
                    const userCheck = await getUser({ id });

                    if (userCheck.length == 0) {
                        throw new Error(
                            JSON.stringify({
                                errorkey: 'verification',
                                body: {
                                    status: 404,
                                    data: {
                                        message: 'No such user found'
                                    }
                                }
                            })
                        );
                    }

                    return {
                        message: 'User Validated',
                        id
                    };
                },
                delete: [
                    'verification',
                    async (results) => {
                        const { id } = results.verification;

                        const user = await deleteUser(id);

                        if (user) {
                            return {
                                message: 'User deleted',
                                user
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
