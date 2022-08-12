import async from 'async';
import Joi from 'joi';

import { createAttribute } from '../../../../prisma/products/attribute';
import handleResponse from '../../../../utils/helpers/handleResponse';
import validate from '../../../../utils/middlewares/validation';
import runMiddleware from '../../../../utils/helpers/runMiddleware';
import auth from '../../../../utils/middlewares/auth';

const schema = {
    body: Joi.object({
        name: Joi.string().required(),
        description: Joi.string().required(),
        slug: Joi.string().required()
    })
};

const handler = async (req, res) => {
    await runMiddleware(req, res, auth);

    if (req.method == 'POST') {
        async.auto(
            {
                create: [
                    async () => {
                        const { body } = req;

                        const res = await createAttribute(body);

                        if (res) {
                            return {
                                message: 'New Attribute Created',
                                attribute: res
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
