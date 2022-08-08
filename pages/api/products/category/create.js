import async from 'async';
import Joi from 'joi';

import {
  createCategory,
  getCategory
} from '../../../../prisma/products/category';
import handleResponse from '../../../../utils/helpers/handleResponse';
import validate from '../../../../utils/middlewares/validation';
import runMiddleware from '../../../../utils/helpers/runMiddleware';
import auth from '../../../../utils/middlewares/auth';

const schema = {
  body: Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    slug: Joi.string().required(),
    parentCategoryId: Joi.string().optional()
  })
};

const handler = async (req, res) => {
  await runMiddleware(req, res, auth);
  if (req.method == 'POST') {
    async.auto(
      {
        verify: async () => {
          const { parentCategoryId } = req.body;

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
                      message: 'Invalid Parent Category ID'
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
        create: [
          'verify',
          async () => {
            const { body } = req;

            const res = await createCategory(body);

            if (res) {
              return {
                message: 'New Category Created',
                category: res
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
