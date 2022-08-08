import Joi from 'joi';
import async from 'async';

import {
  deleteProductImport,
  getProductImport
} from '../../../prisma/products/product_imports';
import handleResponse from '../../../utils/helpers/handleResponse';
import validate from '../../../utils/middlewares/validation';
import auth from '../../../utils/middlewares/auth';
import runMiddleware from '../../../utils/helpers/runMiddleware';
import { prisma } from '../../../prisma/prisma';

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
        verification: async () => {
          const { id } = req.body;

          if (req.admin) {
            const productImportCheck = await getProductImport({
              id
            });

            if (productImportCheck.length == 0) {
              throw new Error(
                JSON.stringify({
                  errorkey: 'verification',
                  body: {
                    status: 404,
                    data: {
                      message: 'No such product import found'
                    }
                  }
                })
              );
            }

            return {
              message: 'Product Import found'
            };
          } else {
            const ownerId = req.user.id;

            const productImportCheck = await prisma.productImports.findMany({
              where: {
                id,
                tenant: {
                  company: {
                    ownerId
                  }
                }
              }
            });

            if (productImportCheck.length == 0) {
              throw new Error(
                JSON.stringify({
                  errorkey: 'verification',
                  body: {
                    status: 404,
                    data: {
                      message: 'No such product import found'
                    }
                  }
                })
              );
            }

            return {
              message: 'Product Import found'
            };
          }
        },
        delete: [
          'verification',
          async () => {
            const { id } = req.body;

            const res = await deleteProductImport(id);

            if (res) {
              return {
                message: 'Product Import deleted',
                productImport: res
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
