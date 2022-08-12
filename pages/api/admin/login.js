import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import async from 'async';
import Joi from 'joi';

import { updateAdmin, getAdmin } from '../../../prisma/admin/admin';
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
                    const adminCheck = await getAdmin({ email });

                    if (adminCheck.length == 0) {
                        throw new Error(
                            JSON.stringify({
                                errorkey: 'verification',
                                body: {
                                    status: 404,
                                    data: {
                                        message: 'No such admin found'
                                    }
                                }
                            })
                        );
                    }

                    return {
                        message: 'Admin Validated',
                        admin: adminCheck[0]
                    };
                },
                login: [
                    'verification',
                    async (results) => {
                        const { password } = req.body;
                        const { admin } = results.verification;

                        if (
                            admin &&
                            (await bcrypt.compare(password, admin.passwordHash))
                        ) {
                            const token = jwt.sign(
                                {
                                    id: admin.id,
                                    email: admin.email,
                                    role: admin.role
                                },
                                process.env.ADMIN_TOKEN_KEY,
                                { expiresIn: '2h' }
                            );

                            const updatedAdmin = await updateAdmin(admin.id, {
                                token
                            });

                            return {
                                message: 'admin Authenticated',
                                updatedAdmin
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
