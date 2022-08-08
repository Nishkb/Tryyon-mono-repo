import async from 'async';
import Joi from 'joi';

import { bulkCreateSKU } from '../../../prisma/products/sku';
import handleResponse from '../../../utils/helpers/handleResponse';
import validate from '../../../utils/middlewares/validation';
import auth from '../../../utils/middlewares/auth';
import runMiddleware from '../../../utils/helpers/runMiddleware';
import { prisma } from '../../../prisma/prisma';

const schema = {
  body: Joi.object({
    body: Joi.array().items(
      Joi.object({
        slug: Joi.string().required(),
        quantity: Joi.number(),
        productId: Joi.string().required(),
        supplierId: Joi.string().optional(),
        published: Joi.boolean().default(false),
        attributes: Joi.object().required(),
        categoryIds: Joi.array().required(),
        price: Joi.number().required(),
        discountedPrice: Joi.number().required(),
        featureImage: Joi.string().optional(),
        gallery: Joi.array().default([])
      })
    )
  })
};

const handler = async (req, res) => {
  await runMiddleware(req, res, auth);

  if (req.method == 'POST') {
    async.auto(
      {
        verify: async () => {
          const { body } = req.body;

          const result = await Promise.all(
            body.map(async (b) => {
              if (req.admin) {
                if (!b.supplierId) {
                  throw new Error(
                    JSON.stringify({
                      errorKey: 'create',
                      body: {
                        status: 409,
                        data: {
                          message: 'Supplier ID not provided'
                        }
                      }
                    })
                  );
                }
              } else {
                const { id } = req.user;
                const tenant = await prisma.tenant.findMany({
                  where: {
                    company: {
                      ownerId: id
                    }
                  }
                });

                if (tenant.length == 0) {
                  throw new Error(
                    JSON.stringify({
                      errorKey: 'create',
                      body: {
                        status: 404,
                        data: {
                          message: 'User does not have a tenant'
                        }
                      }
                    })
                  );
                }

                b.supplierId = tenant[0].id;
              }

              return b;
            })
          );

          return {
            message: 'SKU validated',
            body: result
          };
        },
        create: [
          'verify',
          async (results) => {
            const { body } = results.verify;

            const res = await bulkCreateSKU(body);

            if (res) {
              return {
                message: 'New SKUs Created',
                sku: res
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
