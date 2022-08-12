import async from 'async';

import handleResponse from '../../../utils/helpers/handleResponse';
import { getUser, updateUser } from '../../../prisma/user/user';

const handler = async (req, res) => {
    if (req.method == 'GET') {
        async.auto(
            {
                verify: [
                    async () => {
                        const { code } = req.query;

                        const user = await getUser({ verificationCode: code });

                        if (user.length != 0) {
                            if (
                                user[0].verificationExpiry.getTime() >
                                new Date().getTime()
                            ) {
                                const verifiedUser = await updateUser(
                                    user[0].id,
                                    {
                                        email_verified: true
                                    }
                                );

                                return {
                                    message: 'User verified',
                                    verifiedUser
                                };
                            }

                            throw new Error(
                                JSON.stringify({
                                    errorkey: 'verify',
                                    body: {
                                        status: 409,
                                        data: {
                                            message:
                                                'Verification code is expired'
                                        }
                                    }
                                })
                            );
                        }

                        throw new Error(
                            JSON.stringify({
                                errorkey: 'check',
                                body: {
                                    status: 404,
                                    data: {
                                        message: 'Verification code is invalid'
                                    }
                                }
                            })
                        );
                    }
                ]
            },
            handleResponse(req, res, 'verify')
        );
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
};

export default handler;
