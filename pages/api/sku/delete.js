import Joi from 'joi';
import async from 'async';

import { deleteSKU, getSKU } from '../../../prisma/products/sku';
import handleResponse from '../../../utils/helpers/handleResponse';
import validate from '../../../utils/middlewares/validation';
import auth from '../../../utils/middlewares/auth';
import runMiddleware from '../../../utils/helpers/runMiddleware';
import { prisma } from '../../../prisma/prisma';

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

                    if (req.admin) {
                        const skuCheck = await getSKU(id);

                        if (skuCheck.length == 0) {
                            throw new Error(
                                JSON.stringify({
                                    errorkey: 'verification',
                                    body: {
                                        status: 404,
                                        data: {
                                            message: 'No such sku found'
                                        }
                                    }
                                })
                            );
                        }

                        return {
                            message: 'SKU found'
                        };
                    } else {
                        const ownerId = req.user.id;

                        const skuCheck = await prisma.sKU.findMany({
                            where: {
                                id,
                                supplier: {
                                    company: {
                                        ownerId
                                    }
                                }
                            }
                        });

                        if (skuCheck.length == 0) {
                            throw new Error(
                                JSON.stringify({
                                    errorkey: 'verification',
                                    body: {
                                        status: 404,
                                        data: {
                                            message: 'No such SKU found'
                                        }
                                    }
                                })
                            );
                        }

                        return {
                            message: 'SKU found'
                        };
                    }
                },
                delete: [
                    'verification',
                    async () => {
                        const { id } = req.body;

                        const res = await deleteSKU(id);

                        if (res) {
                            return {
                                message: 'SKU deleted',
                                sku: res
                            };
                        }

                        throw new Error(
                            JSON.stringify({
                                errorKey: 'delete',
                                body: {
                                    status: 404,
                                    data: {
                                        message: 'No such SKU found'
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
