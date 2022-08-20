import async from 'async';
import Joi from 'joi';

import { createCompany, getCompany } from '../../../prisma/company/company';
import handleResponse from '../../../utils/helpers/handleResponse';
import validate from '../../../utils/middlewares/validation';
import tmpAuth from '../../../utils/middlewares/temporaryAuth';
import runMiddleware from '../../../utils/helpers/runMiddleware';

const schema = {
    body: Joi.object({
        name: Joi.string().required(),
        description: Joi.string().required(),
        gstNumber: Joi.string().required(),
        gstCertificate: Joi.string().guid({ version: 'uuidv4' }),
        panNumber: Joi.string().required(),
        panCard: Joi.string().guid({ version: 'uuidv4' }),
        aadharNumber: Joi.string().required(),
        aadharCard: Joi.string().guid({ version: 'uuidv4' }),
        adminApproval: Joi.boolean().default(false),
        ownerId: Joi.string().optional()
    })
};

const handler = async (req, res) => {
    await runMiddleware(req, res, tmpAuth);

    if (req.method == 'POST') {
        async.auto(
            {
                verification: async () => {
                    let { ownerId, gstNumber, aadharNumber, panNumber } =
                        req.body;

                    if (req.admin) {
                        if (!ownerId) {
                            throw new Error(
                                JSON.stringify({
                                    errorkey: 'verification',
                                    body: {
                                        status: 409,
                                        data: {
                                            message: 'Owner ID not provided'
                                        }
                                    }
                                })
                            );
                        }
                    } else if (req.user) ownerId = req.user.id;

                    const companyCheck = await getCompany({
                        ownerId,
                        gstNumber,
                        aadharNumber,
                        panNumber
                    });

                    if (companyCheck.length != 0) {
                        throw new Error(
                            JSON.stringify({
                                errorkey: 'verification',
                                body: {
                                    status: 409,
                                    data: {
                                        message:
                                            'Company with same owner or GST Number or Aadhar Number or PAN Number already exists'
                                    }
                                }
                            })
                        );
                    }

                    return {
                        message: 'Company validated',
                        ownerId
                    };
                },
                create: [
                    'verification',
                    async (results) => {
                        const { body } = req;
                        const { ownerId } = results.verification;

                        body.ownerId = ownerId;

                        const res = await createCompany(body);

                        if (res) {
                            return {
                                message: 'New Company Created',
                                company: res
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
