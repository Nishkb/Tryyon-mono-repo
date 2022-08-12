import Joi from 'joi';
import async from 'async';

import { updateCompany, getCompany } from '../../../prisma/company/company';
import handleResponse from '../../../utils/helpers/handleResponse';
import validate from '../../../utils/middlewares/validation';
import auth from '../../../utils/middlewares/auth';
import runMiddleware from '../../../utils/helpers/runMiddleware';

const schema = {
    body: Joi.object({
        id: Joi.string().optional(),
        name: Joi.string().optional(),
        description: Joi.string().optional(),
        gstNumber: Joi.string().optional(),
        gstCertificate: Joi.string().guid({ version: 'uuidv4' }).optional(),
        panNumber: Joi.string().optional(),
        panCard: Joi.string().guid({ version: 'uuidv4' }).optional(),
        aadharNumber: Joi.string().optional(),
        aadharCard: Joi.string().guid({ version: 'uuidv4' }).optional(),
        adminApproval: Joi.boolean().optional()
    })
};

const handler = async (req, res) => {
    await runMiddleware(req, res, auth);
    if (req.method == 'POST') {
        async.auto(
            {
                verification: async () => {
                    if (!req.admin) {
                        // if its a non admin user
                        const ownerId = req.user.id;
                        const companyCheck = await getCompany({ ownerId });

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

                        return {
                            message: 'Company found',
                            company: companyCheck[0]
                        };
                    }

                    const { id } = req.body;

                    if (!id) {
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

                    const company = await getCompany({ id });

                    if (company.length == 0) {
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

                    return {
                        message: 'Company found',
                        company: company[0]
                    };
                },
                updateCompany: [
                    'verification',
                    async (results) => {
                        const { body } = req;
                        if (body.id) delete body.id;

                        const { company } = results.verification;

                        const updatedCompany = await updateCompany(
                            company.id,
                            body
                        );

                        if (updatedCompany) {
                            return {
                                message: 'Company updated',
                                updatedCompany
                            };
                        }

                        throw new Error(
                            JSON.stringify({
                                errorKey: 'updateCompany',
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
            handleResponse(req, res, 'updateCompany')
        );
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
};

export default validate(schema, handler);
