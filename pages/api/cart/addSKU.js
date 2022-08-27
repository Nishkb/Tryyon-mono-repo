import async from 'async';
import Joi from 'joi';

import validate from '../../../utils/middlewares/validation';
import handleResponse from '../../../utils/helpers/handleResponse';
import uidAuth from '../../../utils/middlewares/uid_auth';
import runMiddleware from '../../../utils/helpers/runMiddleware';
import { addSKU, getCart } from '../../../prisma/cart/cart';

const schema = {
    body: Joi.object({
        skuIds: Joi.array().required()
    })
};

const handler = async (req, res) => {
    await runMiddleware(req, res, uidAuth);

    if (req.method == 'POST') {
        async.auto(
            {
                verify: [
                    async () => {
                        const { uid } = req;

                        const cart = await getCart({ uid });

                        if (cart.length == 0) {
                            throw new Error(
                                JSON.stringify({
                                    errorKey: 'verify',
                                    body: {
                                        status: 404,
                                        data: {
                                            message: 'Cart not found'
                                        }
                                    }
                                })
                            );
                        }

                        return {
                            message: 'Cart found',
                            cart: cart[0]
                        };
                    }
                ],
                add: [
                    'verify',
                    async ({ verify }) => {
                        const { cart } = verify;
                        const { skuIds } = req.body;

                        console.log(JSON.stringify(cart));

                        const updatedCart = await addSKU(cart.id, skuIds);

                        if (updatedCart) {
                            return {
                                message: 'SKUs added',
                                updatedCart
                            };
                        }

                        throw new Error(
                            JSON.stringify({
                                errorKey: 'add',
                                body: {
                                    status: 500,
                                    data: {
                                        message: 'Internal server error'
                                    }
                                }
                            })
                        );
                    }
                ]
            },
            handleResponse(req, res, 'add')
        );
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
};

export default validate(schema, handler);
