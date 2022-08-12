import async from 'async';
import Joi from 'joi';

import {
    deleteCategory,
    getCategory
} from '../../../../prisma/products/category';
import handleResponse from '../../../../utils/helpers/handleResponse';
import validate from '../../../../utils/middlewares/validation';
import runMiddleware from '../../../../utils/helpers/runMiddleware';
import auth from '../../../../utils/middlewares/auth';

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
                verify: async () => {
                    const { id } = req.body;
                    const categories = await getCategory({ id });

                    if (categories.length == 0) {
                        throw new Error(
                            JSON.stringify({
                                errorKey: 'verify',
                                body: {
                                    status: 409,
                                    data: {
                                        message: 'Invalid Category ID'
                                    }
                                }
                            })
                        );
                    }

                    return {
                        message: 'Category verified'
                    };
                },
                delete: [
                    'verify',
                    async () => {
                        const { id } = req.body;

                        const res = await deleteCategory(id);

                        if (res) {
                            return {
                                message: 'Category Deleted',
                                category: res
                            };
                        }

                        throw new Error(
                            JSON.stringify({
                                errorKey: 'delete',
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
            handleResponse(req, res, 'delete')
        );
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
};

export default validate(schema, handler);
