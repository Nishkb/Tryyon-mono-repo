import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import async from 'async';
import Joi from 'joi';

import { getUser, updateUser } from '../../../prisma/user/user';
import validate from '../../../utils/middlewares/validation';
import handleResponse from '../../../utils/helpers/handleResponse';

const schema = {
    body: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required()
    })
};

const handler = async (req, res) => {
    if (req.method == 'POST') {
        async.auto(
            {
                verification: async () => {
                    const { email } = req.body;
                    const userCheck = await getUser({ email });

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
                        message: 'User Validated'
                    };
                },
                login: [
                    'verification',
                    async () => {
                        const { email, password } = req.body;
                        const user = await getUser({ email });

                        if (
                            user.length != 0 &&
                            (await bcrypt.compare(
                                password,
                                user[0].passwordHash
                            ))
                        ) {
                            const token = jwt.sign(
                                {
                                    id: user[0].id,
                                    email: user[0].email,
                                    role: user[0].role,
                                    email_verified: user[0].email_verified,
                                    adminApproval: user[0].company
                                        ? user[0].company.adminApproval
                                        : false
                                },
                                process.env.TOKEN_KEY,
                                { expiresIn: '2h' }
                            );

                            const updatedUser = await updateUser(user[0].id, {
                                token
                            });

                            return {
                                message: 'User Authenticated',
                                updatedUser
                            };
                        }

                        throw new Error(
                            JSON.stringify({
                                errorkey: 'login',
                                body: {
                                    status: 400,
                                    data: {
                                        message: 'Invalid Credentials'
                                    }
                                }
                            })
                        );
                    }
                ]
            },
            handleResponse(req, res, 'login')
        );
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
};

export default validate(schema, handler);
