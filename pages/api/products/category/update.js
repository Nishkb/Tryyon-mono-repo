import async from 'async';
import Joi from 'joi';

import {
    updateCategory,
    getCategory
} from '../../../../prisma/products/category';
import handleResponse from '../../../../utils/helpers/handleResponse';
import validate from '../../../../utils/middlewares/validation';
import runMiddleware from '../../../../utils/helpers/runMiddleware';
import auth from '../../../../utils/middlewares/auth';

const schema = {
    body: Joi.object({
        id: Joi.string().required(),
        name: Joi.string().optional(),
        description: Joi.string().optional(),
        slug: Joi.string().optional(),
        parentCategoryId: Joi.string().optional(),
        root: Joi.boolean().optional()
    })
};

const handler = async (req, res) => {
    await runMiddleware(req, res, auth);

    if (req.method == 'POST') {
        async.auto(
            {
                verify: async () => {
                    const { id, parentCategoryId } = req.body;
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

                    if (parentCategoryId) {
                        const parentCategory = await getCategory({
                            id: parentCategoryId
                        });

                        if (parentCategory.length == 0) {
                            throw new Error(
                                JSON.stringify({
                                    errorKey: 'verify',
                                    body: {
                                        status: 409,
                                        data: {
                                            message:
                                                'Invalid Parent Category ID'
                                        }
                                    }
                                })
                            );
                        }
                    }

                    return {
                        message: 'Category verified'
                    };
                },
                update: [
                    'verify',
                    async () => {
                        const { id, ...updateData } = req.body;

                        const res = await updateCategory(id, updateData);

                        if (res) {
                            return {
                                message: 'Category Updated',
                                category: res
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
