import async from 'async';
import Joi from 'joi';

import validate from '../../../utils/middlewares/validation';
import handleResponse from '../../../utils/helpers/handleResponse';
import runMiddleware from '../../../utils/helpers/runMiddleware';
import auth from '../../../utils/middlewares/auth';

import { getAdmin } from '../../../prisma/admin/admin';

const schema = {
    query: Joi.object({
        adminId: Joi.string().required()
    })
};

const handler = async (req, res) => {
    await runMiddleware(req, res, auth);
    if (!req.admin) res.status(401).json({ message: 'Unauthorized access' });
    else if (req.method == 'GET') {
        async.auto(
            {
                main: [
                    async () => {
                        const { adminId } = req.query;

                        const admin = await getAdmin({ id: adminId });

                        if (admin.length != 0) {
                            return {
                                message: 'Admin found',
                                admin: admin[0]
                            };
                        }

                        throw new Error(
                            JSON.stringify({
                                errorKey: 'main',
                                body: {
                                    status: 404,
                                    data: {
                                        message: 'No such Admin found'
                                    }
                                }
                            })
                        );
                    }
                ]
            },
            handleResponse(req, res, 'main')
        );
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
};

export default validate(schema, handler);
