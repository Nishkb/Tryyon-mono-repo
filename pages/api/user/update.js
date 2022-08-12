import async from 'async';
import Joi from 'joi';
import bcrypt from 'bcryptjs';

import { getUser, updateUser } from '../../../prisma/user/user';
import handleResponse from '../../../utils/helpers/handleResponse';
import validate from '../../../utils/middlewares/validation';
import runMiddleware from '../../../utils/helpers/runMiddleware';
import auth from '../../../utils/middlewares/auth';

const schema = {
    body: Joi.object({
        id: Joi.string().optional(),
        username: Joi.string().optional(),
        firstname: Joi.string().optional(),
        lastname: Joi.string().optional(),
        phone: Joi.number().min(1000000000).max(9999999999).required(),
        email: Joi.string().optional(),
        password: Joi.string().optional()
    })
};

const handler = async (req, res) => {
    await runMiddleware(req, res, auth);
    if (req.method == 'POST') {
        async.auto(
            {
                verification: async () => {
                    let id;
                    if (req.admin) {
                        id = req.body.id;

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

                        const checkExistence = await getUser({ id });

                        if (checkExistence.length == 0) {
                            throw new Error(
                                JSON.stringify({
                                    errorkey: 'verification',
                                    body: {
                                        status: 409,
                                        data: {
                                            message:
                                                'User with given id is deleted or does not exists'
                                        }
                                    }
                                })
                            );
                        }
                    } else if (req.user) {
                        id = req.user.id;
                    }

                    const { email, username, phone } = req.body;

                    let userCheck = [];
                    if (email || username || phone)
                        userCheck = await getUser({ username, email, phone });

                    if (userCheck.length != 0) {
                        throw new Error(
                            JSON.stringify({
                                errorkey: 'verification',
                                body: {
                                    status: 409,
                                    data: {
                                        message:
                                            'User with same username or email or phone already exists'
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
                update: [
                    'verification',
                    async (results) => {
                        const { body } = req;
                        if (body.id) delete body.id;

                        const { id } = results.verification;

                        if (body.password) {
                            body.passwordHash = await bcrypt.hash(
                                body.password,
                                10
                            );
                            delete body.password;
                        }

                        const updatedUser = await updateUser(id, body);

                        if (updatedUser)
                            return { message: 'User updated', updatedUser };

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
