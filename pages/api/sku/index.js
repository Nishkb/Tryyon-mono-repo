import async from 'async';
import Joi from 'joi';

import { searchSKUs } from '../../../prisma/products/sku';
import handleResponse from '../../../utils/helpers/handleResponse';
import validate from '../../../utils/middlewares/validation';
import auth from '../../../utils/middlewares/auth';
import runMiddleware from '../../../utils/helpers/runMiddleware';

const schema = {
    body: Joi.object({
        id: Joi.string().optional(),
        inStock: Joi.boolean().optional(),
        published: Joi.boolean().optional(),
        priceFrom: Joi.number().optional(),
        priceTo: Joi.number().optional(),
        supplierId: Joi.string().optional(),
        productId: Joi.string().optional(),
        categoryId: Joi.string().optional(),
        attributes: Joi.object().optional(),
        pagination: Joi.boolean().optional(),
        offset: Joi.number().optional(),
        limit: Joi.number().optional()
    })
};

const handler = async (req, res) => {
    await runMiddleware(req, res, auth);

    if (req.method == 'POST') {
        async.auto(
            {
                read: [
                    async () => {
                        const { body } = req;
                        const { pagination, offset, limit } = body;

                        if (pagination && (!offset || !limit || offset < 1)) {
                            throw new Error(
                                JSON.stringify({
                                    errorKey: 'read',
                                    body: {
                                        status: 409,
                                        data: {
                                            message:
                                                'Correct offset or limit not provided for pagination'
                                        }
                                    }
                                })
                            );
                        }

                        const skus = await searchSKUs(body);

                        if (skus.length != 0) {
                            return {
                                message: 'SKUs found',
                                skus
                            };
                        }

                        throw new Error(
                            JSON.stringify({
                                errorKey: 'read',
                                body: {
                                    status: 404,
                                    data: {
                                        message: 'No SKU found'
                                    }
                                }
                            })
                        );
                    }
                ]
            },
            handleResponse(req, res, 'read')
        );
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
};

export default validate(schema, handler);
