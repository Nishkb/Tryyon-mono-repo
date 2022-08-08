import async from 'async';
import Joi from 'joi';

import {
  getAssociation,
  updateAssociation
} from '../../../prisma/association/association';
import handleResponse from '../../../utils/helpers/handleResponse';
import runMiddleware from '../../../utils/helpers/runMiddleware';
import auth from '../../../utils/middlewares/auth';
import validate from '../../../utils/middlewares/validation';

const schema = {
  body: Joi.object({
    userId: Joi.string().optional(),
    tenantId: Joi.string().optional(),
    approval: Joi.boolean().optional()
  })
};

const handler = async (req, res) => {
  await runMiddleware(req, res, auth);
  if (req.method == 'POST') {
    async.auto(
      {
        verify: async () => {
          // if admin user is trying to make a new Association
          if (req.admin) {
            const { userId, tenantId } = req.body;

            // userId is needed
            if (!userId) {
              throw new Error(
                JSON.stringify({
                  errorkey: 'verify',
                  body: {
                    status: 409,
                    data: {
                      message: 'userId not provided'
                    }
                  }
                })
              );
            }

            const associationCheck = await getAssociation({
              userId
            });

            // if the user is already doesn't have an association
            if (associationCheck.length == 0) {
              throw new Error(
                JSON.stringify({
                  errorkey: 'verify',
                  body: {
                    status: 409,
                    data: {
                      message: 'Given user does not have an association'
                    }
                  }
                })
              );
            }

            if (tenantId) {
              const tenant = await prisma.tenant.findMany({
                where: {
                  id: tenantId,
                  company: {
                    ownerId: userId
                  }
                }
              });

              if (tenant.length == 0) {
                throw new Error(
                  JSON.stringify({
                    errorkey: 'verify',
                    body: {
                      status: 409,
                      data: {
                        message: 'Given user is not the owner of tenant'
                      }
                    }
                  })
                );
              }
            }

            return {
              message: 'Association validated',
              association: associationCheck[0]
            };
          }

          // if an authenticated user is trying to create an association
          if (req.user) {
            const { id } = req.user; // userId is not needed to be there in body
            const { tenantId, approval } = req.body;
            if (approval) delete req.body.approval;

            const associationCheck = await getAssociation({
              userId: id
            });

            // if the user is already having an association
            if (associationCheck.length == 0) {
              throw new Error(
                JSON.stringify({
                  errorkey: 'verify',
                  body: {
                    status: 404,
                    data: {
                      message: 'User does not have an association'
                    }
                  }
                })
              );
            }

            const tenant = await prisma.tenant.findMany({
              where: {
                id: tenantId,
                company: {
                  ownerId: id
                }
              }
            });

            if (tenant.length == 0) {
              throw new Error(
                JSON.stringify({
                  errorkey: 'verify',
                  body: {
                    status: 409,
                    data: {
                      message: 'Given user is not the owner of tenant'
                    }
                  }
                })
              );
            }

            return {
              message: 'Association validated',
              association: associationCheck[0]
            };
          }
        },
        update: [
          'verify',
          async (results) => {
            const { body } = req;
            if (req.user) body.userId = req.user.id;

            const { id } = results.verify.association;
            const updatedAssociation = await updateAssociation(id, body);

            if (updatedAssociation)
              return {
                message: 'Association updated',
                updatedAssociation
              };

            throw new Error(
              JSON.stringify({
                errorkey: 'update',
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
