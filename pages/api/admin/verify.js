import async from 'async';

import handleResponse from '../../../utils/helpers/handleResponse';
import { getAdmin, updateAdmin } from '../../../prisma/admin/admin';

const handler = async (req, res) => {
    if (req.method == 'GET') {
        async.auto(
            {
                verify: [
                    async () => {
                        const { code } = req.query;

                        const admin = await getAdmin({
                            verificationCode: code
                        });

                        if (admin.length != 0) {
                            if (
                                admin[0].verificationExpiry.getTime() >
                                new Date().getTime()
                            ) {
                                const verifiedAdmin = await updateAdmin(
                                    admin[0].id,
                                    {
                                        email_verified: true
                                    }
                                );

                                return {
                                    message: 'Admin verified',
                                    verifiedAdmin
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
