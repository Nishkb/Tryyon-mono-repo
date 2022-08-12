import Joi from 'joi';
import async from 'async';

import {
    getProductImport,
    updateProductImport
} from '../../../prisma/products/product_imports';
import handleResponse from '../../../utils/helpers/handleResponse';
import validate from '../../../utils/middlewares/validation';
import auth from '../../../utils/middlewares/auth';
import runMiddleware from '../../../utils/helpers/runMiddleware';
import { prisma } from '../../../prisma/prisma';

const schema = {
    body: Joi.object({
        id: Joi.string().required(),
        updateData: Joi.object({
            skuIds: Joi.array().optional(),
            skus: Joi.object().optional(),
            status: Joi.boolean().optional(),
            override: Joi.object({
                price: Joi.number().optional(),
                sellingPrice: Joi.number().optional()
            })
        })
    })
};

const handler = async (req, res) => {
    await runMiddleware(req, res, auth);

    if (req.method == 'POST') {
        async.auto(
            {
                verification: async () => {
                    const { id, updateData } = req.body;
                    const { skuIds, override } = updateData;

                    const productImportCheck = await getProductImport({ id });

                    if (productImportCheck.length == 0) {
                        throw new Error(
                            JSON.stringify({
                                errorkey: 'verification',
                                body: {
                                    status: 404,
                                    data: {
                                        message: 'No such product import found'
                                    }
                                }
                            })
                        );
                    }

                    if (skuIds && skuIds.length != 0) {
                        const skuCheck = await prisma.sKU.findMany({
                            where: {
                                id: {
                                    in: skuIds
                                },
                                productId: productImportCheck[0].productId
                            }
                        });

                        if (skuCheck.length != skuIds.length) {
                            throw new Error(
                                JSON.stringify({
                                    errorKey: 'verify',
                                    body: {
                                        status: 409,
                                        data: {
                                            message:
                                                'One or more SKUs are not valid'
                                        }
                                    }
                                })
                            );
                        }
                    }

                    if (
                        override !== undefined &&
                        (override.price || override.sellingPrice)
                    ) {
                        if (productImportCheck[0].type != 'discount') {
                            throw new Error(
                                JSON.stringify({
                                    errorKey: 'verify',
                                    body: {
                                        status: 409,
                                        data: {
                                            message:
                                                'Override option not allowed'
                                        }
                                    }
                                })
                            );
                        }
                    }

                    return {
                        message: 'Product Import found',
                        id,
                        updateData
                    };
                },
                update: [
                    'verification',
                    async (results) => {
                        const { id, updateData } = results.verification;

                        const updatedProductImport = await updateProductImport(
                            id,
                            updateData
                        );

                        if (updatedProductImport) {
                            return {
                                message: 'Product Import updated',
                                updatedProductImport
                            };
                        }

                        throw new Error(
                            JSON.stringify({
                                errorKey: 'update',
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
            handleResponse(req, res, 'update')
        );
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
};

export default validate(schema, handler);
