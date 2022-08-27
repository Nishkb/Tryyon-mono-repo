import async from 'async';

import handleResponse from '../../../utils/helpers/handleResponse';
import uidAuth from '../../../utils/middlewares/uid_auth';
import runMiddleware from '../../../utils/helpers/runMiddleware';
import { createCart, getCart } from '../../../prisma/cart/cart';

const handler = async (req, res) => {
    await runMiddleware(req, res, uidAuth);

    if (req.method == 'GET') {
        async.auto(
            {
                read: [
                    async () => {
                        const { uid } = req;

                        const cart = await getCart({ uid });

                        if (cart.length == 0) {
                            const newCart = await createCart({
                                skuIds: [],
                                lastUpdated: new Date(Date.now()).toISOString(),
                                uid
                            });

                            return {
                                message: 'New cart created',
                                cart: newCart
                            };
                        }

                        return {
                            message: 'Cart found',
                            cart
                        };
                    }
                ]
            },
            handleResponse(req, res, 'read')
        );
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
};

export default handler;
