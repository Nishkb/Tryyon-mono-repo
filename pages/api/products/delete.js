import Joi from 'joi';
import async from 'async';

import { deleteProduct, getProduct } from '../../../prisma/products/products';
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
                        const productCheck = await getProduct(id);

                        if (productCheck.length == 0) {
                            throw new Error(
                                JSON.stringify({
                                    errorkey: 'verification',
                                    body: {
                                        status: 404,
                                        data: {
                                            message: 'No such product found'
                                        }
                                    }
                                })
                            );
                        }

                        return {
                            message: 'Product found'
                        };
                    } else {
                        const ownerId = req.user.id;

                        const productCheck = await prisma.product.findMany({
                            where: {
                                id,
                                supplier: {
                                    company: {
                                        ownerId
                                    }
                                }
                            }
                        });

                        if (productCheck.length == 0) {
                            throw new Error(
                                JSON.stringify({
                                    errorkey: 'verification',
                                    body: {
                                        status: 404,
                                        data: {
                                            message: 'No such product found'
                                        }
                                    }
                                })
                            );
                        }

                        return {
                            message: 'Product found'
                        };
                    }
                },
                delete: [
                    'verification',
                    async () => {
                        const { id } = req.body;

                        const res = await deleteProduct(id);

                        if (res) {
                            return {
                                message: 'Product deleted',
                                product: res
                            };
                        }

                        throw new Error(
                            JSON.stringify({
                                errorKey: 'delete',
                                body: {
                                    status: 404,
                                    data: {
                                        message: 'No such Product found'
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
