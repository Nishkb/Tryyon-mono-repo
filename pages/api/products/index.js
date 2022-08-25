import async from 'async';
import Joi from 'joi';

import { searchProducts } from '../../../prisma/products/products';
import handleResponse from '../../../utils/helpers/handleResponse';
import validate from '../../../utils/middlewares/validation';

const schema = {
    body: Joi.object({
        id: Joi.string().optional(),
        query: Joi.string().optional(),
        inStock: Joi.boolean().optional(),
        published: Joi.boolean().optional(),
        supplierIds: Joi.array().optional(),
        categoryId: Joi.string().optional(),
        attributes: Joi.object().optional(),
        priceFrom: Joi.number().optional(),
        priceTo: Joi.number().optional(),
        sortBy: Joi.string().optional(),
        order: Joi.string().allow('desc', 'asc').optional(),
        pagination: Joi.boolean().optional(),
        offset: Joi.number().optional(),
        limit: Joi.number().optional(),
        locationIds: Joi.array().optional(),
        manufacturer: Joi.string().optional(),
        countryOfOrigin: Joi.string().optional(),
        reseller: Joi.object({
            allowed: Joi.boolean().optional(),
            type: Joi.string().allow('commission', 'discount').optional(),
            discount: Joi.number().min(0).max(100),
            commission: Joi.number().min(0).max(100)
        }).optional(),
        trending: Joi.boolean().optional(),
        featuredFrom: Joi.date().optional(),
        featuredTo: Joi.date().optional(),
        guestCheckout: Joi.boolean().optional(),
        private_product: Joi.boolean().optional(),
        marketPlace: Joi.boolean().optional(),
        excludeTenant: Joi.string().optional()
    })
};

const handler = async (req, res) => {
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

                        const products = await searchProducts(body);

                        if (products.length != 0) {
                            return {
                                message: 'Products found',
                                products
                            };
                        }

                        throw new Error(
                            JSON.stringify({
                                errorKey: 'read',
                                body: {
                                    status: 404,
                                    data: {
                                        message: 'No Product found'
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
