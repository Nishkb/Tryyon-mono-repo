import async from 'async';
import Joi from 'joi';

import { createTenant, getTenant } from '../../../prisma/tenant/tenant';
import { getCompany } from '../../../prisma/company/company';
import handleResponse from '../../../utils/helpers/handleResponse';
import validate from '../../../utils/middlewares/validation';
import auth from '../../../utils/middlewares/auth';
import runMiddleware from '../../../utils/helpers/runMiddleware';

const schema = {
    body: Joi.object({
        companyId: Joi.string().optional(),
        name: Joi.string().required(),
        description: Joi.string().required()
    })
};

const handler = async (req, res) => {
    await runMiddleware(req, res, auth);
    if (req.method == 'POST') {
        async.auto(
            {
                verification: async () => {
                    if (!req.admin) {
                        const { id } = req.user;

                        const companyCheck = await getCompany({ ownerId: id });

                        if (companyCheck.length == 0) {
                            throw new Error(
                                JSON.stringify({
                                    errorkey: 'verification',
                                    body: {
                                        status: 404,
                                        data: {
                                            message:
                                                'User does not have a company'
                                        }
                                    }
                                })
                            );
                        }

                        if (companyCheck[0].tenant) {
                            throw new Error(
                                JSON.stringify({
                                    errorkey: 'verification',
                                    body: {
                                        status: 404,
                                        data: {
                                            message: 'User already has a tenant'
                                        }
                                    }
                                })
                            );
                        }

                        return {
                            message: 'Tenant validated',
                            companyId: companyCheck[0].id
                        };
                    }

                    const { companyId } = req.body;

                    if (!companyId) {
                        throw new Error(
                            JSON.stringify({
                                errorkey: 'verification',
                                body: {
                                    status: 409,
                                    data: {
                                        message: 'Company ID not provided'
                                    }
                                }
                            })
                        );
                    }

                    const tenantCheck = await getTenant({ companyId });

                    if (tenantCheck.length != 0) {
                        throw new Error(
                            JSON.stringify({
                                errorkey: 'verification',
                                body: {
                                    status: 409,
                                    data: {
                                        message:
                                            'Tenant with same company already exists'
                                    }
                                }
                            })
                        );
                    }

                    return {
                        message: 'Tenant validated',
                        companyId
                    };
                },
                create: [
                    'verification',
                    async (results) => {
                        const { body } = req;
                        body.companyId = results.verification.companyId;

                        const res = await createTenant(body);

                        if (res) {
                            return {
                                message: 'New Tenant Created',
                                tenant: res
                            };
                        }

                        throw new Error(
                            JSON.stringify({
                                errorKey: 'create',
                                body: {
                                    status: 500,
                                    data: {
                                        message: 'Internal Server Error'
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
