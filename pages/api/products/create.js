import async from 'async';
import Joi from 'joi';

import { createProduct } from '../../../prisma/products/products';
import handleResponse from '../../../utils/helpers/handleResponse';
import validate from '../../../utils/middlewares/validation';
import auth from '../../../utils/middlewares/auth';
import runMiddleware from '../../../utils/helpers/runMiddleware';
import { prisma } from '../../../prisma/prisma';

const schema = {
  body: Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    shortDescriptions: Joi.string().required(),
    slug: Joi.string().required(),
    quantity: Joi.number().required(),
    supplierId: Joi.string().optional(),
    published: Joi.boolean().default(false).optional(),
    attributes: Joi.object().required(),
    categoryIds: Joi.array().required(),
    locationIds: Joi.array().required(),
    manufacturer: Joi.string().required(),
    countryOfOrigin: Joi.string().required(),
    trending: Joi.boolean().required(),
    featuredFrom: Joi.date().iso().required(),
    featuredTo: Joi.date().iso().required(),
    guestCheckout: Joi.boolean().required(),
    private_product: Joi.boolean().required(),
    marketPlace: Joi.boolean().required(),
    reseller: Joi.object({
      allowed: Joi.boolean().required(),
      type: Joi.string().allow('commission', 'discount').optional(),
      commission: Joi.number().optional().min(0).max(100),
      discount: Joi.number().optional().min(0).max(100)
    }).required(),
    featureImage: Joi.any(),
    gallery: Joi.array().default([])
  })
};

const handler = async (req, res) => {
  await runMiddleware(req, res, auth);

  if (req.method == 'POST') {
    async.auto(
      {
        verify: async () => {
          const { body } = req;

          if (body.reseller.allowed && !body.reseller.type) {
            throw new Error(
              JSON.stringify({
                errorKey: 'create',
                body: {
                  status: 409,
                  data: {
                    message: 'Reseller type not provided'
                  }
                }
              })
            );
          }

          if (req.admin) {
            if (!body.supplierId) {
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

            body.supplierId = tenant[0].id;
          }

          return {
            message: 'Product validated',
            body
          };
        },
        create: [
          'verify',
          async (results) => {
            const { body } = results.verify;

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
    res.status(405).json({ message: 'Method Not Allowed' });
  }
};

export default validate(schema, handler);
