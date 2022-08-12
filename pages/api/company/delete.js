import Joi from 'joi';
import async from 'async';

import { deleteCompany, getCompany } from '../../../prisma/company/company';
import handleResponse from '../../../utils/helpers/handleResponse';
import validate from '../../../utils/middlewares/validation';
import auth from '../../../utils/middlewares/auth';
import runMiddleware from '../../../utils/helpers/runMiddleware';

const schema = {
    body: Joi.object({
        id: Joi.string().required()
    })
};

const handler = async (req, res) => {
    await runMiddleware(req, res, auth);
    if (req.method == 'DELETE') {
        async.auto(
            {
                verification: async () => {
                    const { id } = req.body;
                    const companyCheck = await getCompany({ id });

                    if (companyCheck.length == 0) {
                        throw new Error(
                            JSON.stringify({
                                errorkey: 'verification',
                                body: {
                                    status: 404,
                                    data: {
                                        message: 'Company not found'
                                    }
                                }
                            })
                        );
                    }

                    if (req.user) {
                        const ownerId = req.user.id;

                        if (companyCheck[0].ownerId != ownerId) {
                            throw new Error(
                                JSON.stringify({
                                    errorkey: 'verification',
                                    body: {
                                        status: 401,
                                        data: {
                                            message:
                                                'User is not the owner of this company'
                                        }
                                    }
                                })
                            );
                        }
                    }

                    return {
                        message: 'Company found'
                    };
                },
                delete: [
                    'verification',
                    async () => {
                        const { id } = req.body;

                        const res = await deleteCompany(id);

                        if (res) {
                            return {
                                message: 'Company deleted',
                                company: res
                            };
                        }

                        throw new Error(
                            JSON.stringify({
                                errorKey: 'delete',
                                body: {
                                    status: 404,
                                    data: {
                                        message: 'No such Company found'
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
