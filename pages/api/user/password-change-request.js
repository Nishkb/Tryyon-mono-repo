import async from 'async';
import Joi from 'joi';
import { uuid } from 'uuidv4';

import { getUser, updateUser } from '../../../prisma/user/user';
import handleResponse from '../../../utils/helpers/handleResponse';
import validate from '../../../utils/middlewares/validation';
import transporter from '../../../utils/mail/transporter';
import runMiddleware from '../../../utils/helpers/runMiddleware';
import auth from '../../../utils/middlewares/auth';

const schema = {
    body: Joi.object({
        email: Joi.string().required()
    })
};

const handler = async (req, res) => {
    await runMiddleware(req, res, auth);

    if (!req.admin) res.status(401).json({ message: 'Unauthorized access' });

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
                                        message: 'User not found'
                                    }
                                }
                            })
                        );
                    }

                    return {
                        message: 'New User Validated',
                        user: userCheck[0]
                    };
                },
                generate: [
                    'verification',
                    async (results) => {
                        const { user } = results.verification;

                        const verificationCode = uuid();
                        const verificationExpiry = new Date(
                            new Date().getTime() + 1 * 60 * 60 * 1000
                        );

                        const u = await updateUser(user.id, {
                            verificationCode,
                            verificationExpiry
                        });

                        return {
                            message: 'Password change process initiated',
                            user: u
                        };
                    }
                ],
                email: [
                    'generate',
                    async (results) => {
                        const { user } = results.generate;

                        const mailOptions = {
                            from: `"Tryyon" <${process.env.MAIL_USERNAME}>`,
                            to: user.email,
                            subject: 'Change password',
                            text: `Please click this link to change your password: ${
                                process.env.BASE_URL +
                                '/auth/change-password?code=' +
                                user.verificationCode
                            }`
                        };

                        const info = await transporter.sendMail(mailOptions);

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
                ]
            },
            handleResponse(req, res, 'generate')
        );
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
};

export default validate(schema, handler);
