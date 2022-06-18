import async from 'async';
import Joi from 'joi';

import { createProduct } from '../../../prisma/products/products';
import handleResponse from '../../../utils/helpers/handleResponse';
import validate from '../../../utils/middlewares/validation';

const schema = {
  body: Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    shortDescriptions: Joi.string().required(),
    slug: Joi.string().required(),
    quantity: Joi.number(),
    approved: Joi.boolean().default(false),
    published: Joi.boolean().default(false),
    price: Joi.number().required(),
    discountedPrice: Joi.number().required()
  })
};

const handler = async (req, res) => {
  if (req.method == 'POST') {
    async.auto(
      {
        create: [
          async () => {
            const { body } = req;

            const res = await createProduct(body);

            if (res) {
              return {
                message: 'New Product Created',
                product: res
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
    res.send(405).json({ message: 'Method Not Allowed' });
  }
};

export default validate(schema, handler);