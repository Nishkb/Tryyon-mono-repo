import async from 'async';
import Joi from 'joi';

import {
    updateAttribute,
    getAttribute
} from '../../../../prisma/products/attribute';
import handleResponse from '../../../../utils/helpers/handleResponse';
import validate from '../../../../utils/middlewares/validation';
import runMiddleware from '../../../../utils/helpers/runMiddleware';
import auth from '../../../../utils/middlewares/auth';

const schema = {
    body: Joi.object({
        id: Joi.string().required(),
        name: Joi.string().optional(),
        description: Joi.string().optional(),
        slug: Joi.string().optional()
    })
};

const handler = async (req, res) => {
    await runMiddleware(req, res, auth);
    if (req.method == 'POST') {
        async.auto(
            {
                verify: async () => {
                    const { id, parentAttributeId } = req.body;
                    const attributes = await getAttribute({ id });

                    if (attributes.length == 0) {
                        throw new Error(
                            JSON.stringify({
                                errorKey: 'verify',
                                body: {
                                    status: 409,
                                    data: {
                                        message: 'Invalid Attribute ID'
                                    }
                                }
                            })
                        );
                    }

                    if (parentAttributeId) {
                        const parentAttribute = await getAttribute({
                            id: parentAttributeId
                        });

                        if (parentAttribute.length == 0) {
                            throw new Error(
                                JSON.stringify({
                                    errorKey: 'verify',
                                    body: {
                                        status: 409,
                                        data: {
                                            message:
                                                'Invalid Parent Attribute ID'
                                        }
                                    }
                                })
                            );
                        }
                    }

                    return {
                        message: 'Attribute verified'
                    };
                },
                update: [
                    'verify',
                    async () => {
                        const { id, ...updateData } = req.body;

                        const res = await updateAttribute(id, updateData);

                        if (res) {
                            return {
                                message: 'Attribute Updated',
                                attribute: res
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
