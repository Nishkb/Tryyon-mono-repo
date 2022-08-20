import async from 'async';
import Joi from 'joi';
import bcrypt from 'bcryptjs';

import { getUser, updateUser } from '../../../prisma/user/user';
import handleResponse from '../../../utils/helpers/handleResponse';
import validate from '../../../utils/middlewares/validation';

const schema = {
    body: Joi.object({
        code: Joi.string().required(),
        password: Joi.string().required()
    })
};

const handler = async (req, res) => {
    if (req.method == 'POST') {
        async.auto(
            {
                verification: async () => {
                    const { code } = req.body;

                    const userCheck = await getUser({ verificationCode: code });

                    if (userCheck.length == 0) {
                        throw new Error(
                            JSON.stringify({
                                errorkey: 'verification',
                                body: {
                                    status: 409,
                                    data: {
                                        message: 'Invalid verification code'
                                    }
                                }
                            })
                        );
                    }

                    if (
                        userCheck[0].verificationExpiry.getTime() <=
                        new Date().getTime()
                    ) {
                        throw new Error(
                            JSON.stringify({
                                errorkey: 'verify',
                                body: {
                                    status: 409,
                                    data: {
                                        message: 'Verification code is expired'
                                    }
                                }
                            })
                        );
                    }

                    return {
                        message: 'User Validated',
                        user: userCheck[0]
                    };
                },
                update: [
                    'verification',
                    async (results) => {
                        const { body } = req;
                        const { user } = results.verification;

                        if (body.password) {
                            body.passwordHash = await bcrypt.hash(
                                body.password,
                                10
                            );
                            delete body.password;
                            delete body.code;
                        }

                        const updatedUser = await updateUser(user.id, body);

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
