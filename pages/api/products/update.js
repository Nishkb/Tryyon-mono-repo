import Joi from 'joi';
import async from 'async';

import { updateProduct, getProduct } from '../../../prisma/products/products';
import handleResponse from '../../../utils/helpers/handleResponse';
import validate from '../../../utils/middlewares/validation';
import auth from '../../../utils/middlewares/auth';
import runMiddleware from '../../../utils/helpers/runMiddleware';
import { prisma } from '../../../prisma/prisma';

const schema = {
  body: Joi.object({
    id: Joi.string().required(),
    updateData: Joi.object({
      name: Joi.string().optional(),
      description: Joi.string().optional(),
      shortDescriptions: Joi.string().optional(),
      slug: Joi.string().optional(),
      quantity: Joi.number(),
      published: Joi.boolean().optional(),
      attributes: Joi.object().optional(),
      categoryIds: Joi.array().optional(),
      locationIds: Joi.array().optional(),
      categories: Joi.object().optional(),
      locations: Joi.object().optional(),
      manufacturer: Joi.string().optional(),
      countryOfOrigin: Joi.string().optional(),
      trending: Joi.boolean().optional(),
      featuredFrom: Joi.date().iso().optional(),
      featuredTo: Joi.date().iso().optional(),
      guestCheckout: Joi.boolean().optional(),
      private_product: Joi.boolean().optional(),
      marketPlace: Joi.boolean().optional(),
      reseller: Joi.object({
        allowed: Joi.boolean().required(),
        type: Joi.string().allow('commission', 'discount').required(),
        commission: Joi.number().optional().min(0).max(100),
        discount: Joi.number().optional().min(0).max(100)
      }).optional(),
      images: Joi.array().optional()
    })
  })
};

const handler = async (req, res) => {
  await runMiddleware(req, res, auth);

  if (req.method == 'POST') {
    async.auto(
      {
        verification: async () => {
          const { id } = req.body;

          if (req.admin) {
            const productCheck = await getProduct(id);

            if (productCheck.length == 0) {
              throw new Error(
                JSON.stringify({
                  errorkey: 'verification',
                  body: {
                    status: 404,
                    data: {
                      message: 'No such product found'
                    }
                  }
                })
              );
            }

            return {
              message: 'Product found'
            };
          } else {
            const ownerId = req.user.id;

            const productCheck = await prisma.product.findMany({
              where: {
                id,
                supplier: {
                  company: {
                    ownerId
                  }
                }
              }
            });

            if (productCheck.length == 0) {
              throw new Error(
                JSON.stringify({
                  errorkey: 'verification',
                  body: {
                    status: 404,
                    data: {
                      message: 'No such product found'
                    }
                  }
                })
              );
            }

            return {
              message: 'Product found'
            };
          }
        },
        updateProduct: [
          'verification',
          async () => {
            const { id, updateData } = req.body;

            const product = await updateProduct(id, updateData);

            if (product) {
              return {
                message: 'Product updated',
                product
              };
            }

            throw new Error(
              JSON.stringify({
                errorKey: 'updateProduct',
                body: {
                  status: 404,
                  data: {
                    message: 'No such Product found'
                  }
                }
              })
            );
          }
        ]
      },
      handleResponse(req, res, 'updateProduct')
    );
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
};

export default validate(schema, handler);
