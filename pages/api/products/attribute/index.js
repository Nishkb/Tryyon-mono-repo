import async from 'async';

import { searchAttribute } from '../../../../prisma/products/attribute';
import handleResponse from '../../../../utils/helpers/handleResponse';
import runMiddleware from '../../../../utils/helpers/runMiddleware';
import auth from '../../../../utils/middlewares/auth';

const handler = async (req, res) => {
    await runMiddleware(req, res, auth);

    if (req.method == 'GET') {
        async.auto(
            {
                read: [
                    async () => {
                        const { query } = req;

                        const attributes = await searchAttribute(query);

                        if (attributes.length == 0) {
                            throw new Error(
                                JSON.stringify({
                                    errorkey: 'read',
                                    body: {
                                        status: 404,
                                        data: {
                                            message: 'No attribute found'
                                        }
                                    }
                                })
                            );
                        }

                        return {
                            message: 'Attributes found',
                            attributes
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
