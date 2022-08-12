import async from 'async';
import Joi from 'joi';

import {
    createProductImport,
    searchProductImport
} from '../../../prisma/products/product_imports';
import handleResponse from '../../../utils/helpers/handleResponse';
import validate from '../../../utils/middlewares/validation';
import auth from '../../../utils/middlewares/auth';
import runMiddleware from '../../../utils/helpers/runMiddleware';
import { prisma } from '../../../prisma/prisma';

const schema = {
    body: Joi.object({
        type: Joi.string().required().allow('discount', 'commission'),
        skuIds: Joi.array().required(),
        productId: Joi.string().required(),
        tenantId: Joi.string().optional(),
        status: Joi.boolean().required(),
        override: Joi.object({
            price: Joi.number().optional(),
            sellingPrice: Joi.number().optional()
        }).default({})
    })
};

const handler = async (req, res) => {
    await runMiddleware(req, res, auth);

    if (req.method == 'POST') {
        async.auto(
            {
                verify: async () => {
                    const { body } = req;

                    if (!req.admin) {
                        const ownerId = req.user.id;
                        const tenantCheck = await prisma.tenant.findMany({
                            where: {
                                company: {
                                    ownerId
                                }
                            }
                        });

                        if (tenantCheck.length == 0) {
                            throw new Error(
                                JSON.stringify({
                                    errorKey: 'verify',
                                    body: {
                                        status: 409,
                                        data: {
                                            message:
                                                'User does not have a tenant'
                                        }
                                    }
                                })
                            );
                        }

                        body.tenantId = tenantCheck[0].id;
                    } else {
                        if (!body.tenantId) {
                            throw new Error(
                                JSON.stringify({
                                    errorKey: 'verify',
                                    body: {
                                        status: 409,
                                        data: {
                                            message: 'Tenant ID not provided'
                                        }
                                    }
                                })
                            );
                        }
                    }

                    const { productId, tenantId, type, skuIds, override } =
                        body;

                    const productImportCheck = await searchProductImport({
                        productId,
                        tenantId
                    });

                    console.log(productId, tenantId, productImportCheck);

                    if (productImportCheck.length != 0) {
                        throw new Error(
                            JSON.stringify({
                                errorKey: 'verify',
                                body: {
                                    status: 409,
                                    data: {
                                        message:
                                            'A product import with same product ID already exists in the tenant'
                                    }
                                }
                            })
                        );
                    }

                    const productCheck = await prisma.product.findRaw({
                        filter: {
                            _id: {
                                $eq: { $oid: productId }
                            },
                            'reseller.allowed': true,
                            'reseller.type': type
                        }
                    });

                    if (productCheck.length == 0) {
                        console.log(productCheck);
                        throw new Error(
                            JSON.stringify({
                                errorKey: 'verify',
                                body: {
                                    status: 409,
                                    data: {
                                        message: `Product not allowed for reselling as ${type}`
                                    }
                                }
                            })
                        );
                    }

                    const skuCheck = await prisma.sKU.findMany({
                        where: {
                            id: {
                                in: skuIds
                            },
                            productId
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

                    if (
                        type == 'discount' &&
                        (!override.price || !override.sellingPrice)
                    ) {
                        throw new Error(
                            JSON.stringify({
                                errorKey: 'verify',
                                body: {
                                    status: 409,
                                    data: {
                                        message:
                                            'Both price and selling price is required for discount type'
                                    }
                                }
                            })
                        );
                    } else if (type == 'commission') {
                        if (override != undefined)
                            throw new Error(
                                JSON.stringify({
                                    errorKey: 'verify',
                                    body: {
                                        status: 409,
                                        data: {
                                            message:
                                                'Override option not allowed for commission type'
                                        }
                                    }
                                })
                            );
                        else {
                            body.override = {};
                        }
                    }

                    return {
                        message: 'Product Import validated',
                        body
                    };
                },
                create: [
                    'verify',
                    async (results) => {
                        const { body } = results.verify;

                        const res = await createProductImport(body);

                        if (res) {
                            return {
                                message: 'New Product Import Created',
                                productImport: res
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
