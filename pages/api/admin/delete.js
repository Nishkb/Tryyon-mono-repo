import async from 'async';
import Joi from 'joi';

import validate from '../../../utils/middlewares/validation';
import handleResponse from '../../../utils/helpers/handleResponse';
import runMiddleware from '../../../utils/helpers/runMiddleware';
import auth from '../../../utils/middlewares/auth';

import { deleteAdmin, getAdmin } from '../../../prisma/admin/admin';

const schema = {
    body: Joi.object({
        id: Joi.string().required()
    })
};

const handler = async (req, res) => {
    await runMiddleware(req, res, auth);
    if (!req.admin) res.status(401).json({ message: 'Unauthorized access' });
    else if (req.method == 'DELETE') {
        async.auto(
            {
                delete: [
                    async () => {
                        const { id } = req.body;

                        const admin = await deleteAdmin(id);

                        if (admin.length != 0) {
                            return {
                                message: 'Admin deleted',
                                admin: admin[0]
                            };
                        }

                        throw new Error(
                            JSON.stringify({
                                errorKey: 'delete',
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
            handleResponse(req, res, 'delete')
        );
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
};

export default validate(schema, handler);
