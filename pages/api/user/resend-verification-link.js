import async from 'async';

import { getUser } from '../../../prisma/user/user';
import handleResponse from '../../../utils/helpers/handleResponse';
import transporter from '../../../utils/mail/transporter';
import runMiddleware from '../../../utils/helpers/runMiddleware';
import tmpAuth from '../../../utils/middlewares/temporaryAuth';

const handler = async (req, res) => {
    await runMiddleware(req, res, tmpAuth);

    if (req.method == 'GET') {
        async.auto(
            {
                verification: async () => {
                    const { id } = req.user;
                    const userCheck = await getUser({ id });

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
                        message: 'User Validated',
                        user: userCheck[0]
                    };
                },
                email: [
                    'verification',
                    async (results) => {
                        const { user } = results.verification;

                        const mailOptions = {
                            from: `"Tryyon" <${process.env.MAIL_USERNAME}>`,
                            to: user.email,
                            subject: 'Verify your account',
                            text: `Please click this link to verify your mail: ${
                                process.env.BASE_URL +
                                '/auth/verify?code=' +
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
            handleResponse(req, res, 'email')
        );
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
};

export default handler;
