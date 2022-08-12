import async from 'async';
import Joi from 'joi';
import { uuid } from 'uuidv4';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { getUser, createUser, updateUser } from '../../../prisma/user/user';
import handleResponse from '../../../utils/helpers/handleResponse';
import validate from '../../../utils/middlewares/validation';
import transporter from '../../../utils/mail/transporter';

const schema = {
    body: Joi.object({
        username: Joi.string().required(),
        firstname: Joi.string().required(),
        lastname: Joi.string().required(),
        phone: Joi.number().min(1000000000).max(9999999999).required(),
        email: Joi.string().required(),
        password: Joi.string().required(),
        role: Joi.string().optional()
    })
};

const handler = async (req, res) => {
    if (req.method == 'POST') {
        async.auto(
            {
                verification: async () => {
                    const { email, username, phone } = req.body;
                    const userCheck = await getUser({ username, email, phone });

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
                        message: 'New User Validated'
                    };
                },
                create: [
                    'verification',
                    async () => {
                        const { body } = req;
                        body.passwordHash = await bcrypt.hash(
                            body.password,
                            10
                        );
                        delete body.password;

                        const createdUser = await createUser(body);

                        if (createdUser) {
                            const token = jwt.sign(
                                {
                                    id: createdUser.id,
                                    email: createdUser.email,
                                    role: createdUser.role
                                },
                                process.env.TOKEN_KEY,
                                { expiresIn: '2h' }
                            );

                            const verificationCode = uuid();
                            const verificationExpiry = new Date(
                                new Date().getTime() + 48 * 60 * 60 * 1000
                            );

                            const user = await updateUser(createdUser.id, {
                                token,
                                verificationCode,
                                verificationExpiry
                            });

                            return { message: 'New user registered', user };
                        }
                        throw new Error(
                            JSON.stringify({
                                errorkey: 'create',
                                body: {
                                    status: 500,
                                    data: {
                                        message: 'Internal Server Error'
                                    }
                                }
                            })
                        );
                    }
                ],
                email: [
                    'create',
                    async () => {
                        const { email } = req.body;
                        const user = await getUser({ email });

                        if (user.length != 0) {
                            const mailOptions = {
                                from: `"Tryyon" <${process.env.MAIL_USERNAME}>`,
                                to: user[0].email,
                                subject: 'Verify your account',
                                text: `Please click this link to verify your mail: ${
                                    process.env.BASE_URL +
                                    '/auth/verify?code=' +
                                    user[0].verificationCode
                                }`
                            };

                            const info = await transporter.sendMail(
                                mailOptions
                            );

                            console.log(info);
                            if (info.rejected.length != 0) {
                                throw new Error(
                                    JSON.stringify({
                                        errorkey: 'email',
                                        body: {
                                            status: 500,
                                            data: {
                                                message:
                                                    'Verification mail not sent'
                                            }
                                        }
                                    })
                                );
                            }

                            return {
                                message: 'Verification email sent'
                            };
                        }

                        throw new Error(
                            JSON.stringify({
                                errorkey: 'email',
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
            handleResponse(req, res, 'create')
        );
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
};

export default validate(schema, handler);
