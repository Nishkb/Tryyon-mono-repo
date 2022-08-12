import async from 'async';

import { searchCategory } from '../../../../prisma/products/category';
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
                        const { id, query, isRoot, includeChildren } =
                            req.query;
                        const categories = await searchCategory({
                            id,
                            query,
                            isRoot,
                            includeChildren
                        });

                        if (categories.length == 0) {
                            throw new Error(
                                JSON.stringify({
                                    errorkey: 'read',
                                    body: {
                                        status: 404,
                                        data: {
                                            message: 'No category found'
                                        }
                                    }
                                })
                            );
                        }

                        return {
                            message: 'Categories found',
                            categories
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
