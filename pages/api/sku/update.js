import Joi from 'joi';
import async from 'async';

import { updateSKU, getSKU } from '../../../prisma/products/sku';
import handleResponse from '../../../utils/helpers/handleResponse';
import validate from '../../../utils/middlewares/validation';
import auth from '../../../utils/middlewares/auth';
import runMiddleware from '../../../utils/helpers/runMiddleware';
import { prisma } from '../../../prisma/prisma';

const schema = {
  body: Joi.object({
    id: Joi.string().required(),
    updateData: Joi.object({
      slug: Joi.string().optional(),
      quantity: Joi.number(),
      productId: Joi.string().optional(),
      published: Joi.boolean().optional(),
      attributes: Joi.object().optional(),
      categoryIds: Joi.array().optional(),
      price: Joi.number().optional(),
      discountedPrice: Joi.number().optional(),
      featureImage: Joi.string().optional(),
      gallery: Joi.array().optional()
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
            const skuCheck = await getSKU(id);

            if (skuCheck.length == 0) {
              throw new Error(
                JSON.stringify({
                  errorkey: 'verification',
                  body: {
                    status: 404,
                    data: {
                      message: 'No such sku found'
                    }
                  }
                })
              );
            }

            return {
              message: 'SKU found'
            };
          } else {
            const ownerId = req.user.id;

            const skuCheck = await prisma.sKU.findMany({
              where: {
                id,
                supplier: {
                  company: {
                    ownerId
                  }
                }
              }
            });

            if (skuCheck.length == 0) {
              throw new Error(
                JSON.stringify({
                  errorkey: 'verification',
                  body: {
                    status: 404,
                    data: {
                      message: 'No such SKU found'
                    }
                  }
                })
              );
            }

            return {
              message: 'SKU found'
            };
          }
        },
        update: [
          'verification',
          async () => {
            const { id, updateData } = req.body;

            const sku = await updateSKU(id, updateData);

            if (sku) {
              return {
                message: 'SKU updated',
                sku
              };
            }

            throw new Error(
              JSON.stringify({
                errorKey: 'update',
                body: {
                  status: 404,
                  data: {
                    message: 'No such SKU found'
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
