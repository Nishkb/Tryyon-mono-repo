import async from 'async';
import Joi from 'joi';

import {
  getAssociation,
  deleteAssociation
} from '../../../prisma/association/association';
import handleResponse from '../../../utils/helpers/handleResponse';
import runMiddleware from '../../../utils/helpers/runMiddleware';
import auth from '../../../utils/middlewares/auth';
import validate from '../../../utils/middlewares/validation';

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
        verify: async () => {
          // if admin user is trying to make a new Association
          if (req.admin) {
            const { id } = req.body;

            const associationCheck = await getAssociation({ id });

            // if no association with given id found
            if (associationCheck.length == 0) {
              throw new Error(
                JSON.stringify({
                  errorkey: 'verify',
                  body: {
                    status: 409,
                    data: {
                      message: 'Association with given id does not exist'
                    }
                  }
                })
              );
            }

            return {
              message: 'Association validated'
            };
          }

          // if an authenticated user is trying to create an association
          if (req.user) {
            const userId = req.user.id;
            const { id } = req.body;
            const associationCheck = await getAssociation({ id });

            if (associationCheck.length != 0) {
              if (associationCheck[0].userId == userId) {
                return {
                  message: 'Association validated'
                };
              }

              throw new Error(
                JSON.stringify({
                  errorkey: 'verify',
                  body: {
                    status: 409,
                    data: {
                      message: 'User is not the owner of the association'
                    }
                  }
                })
              );
            }

            throw new Error(
              JSON.stringify({
                errorkey: 'verify',
                body: {
                  status: 500,
                  data: {
                    message: 'Internal server error'
                  }
                }
              })
            );
          }
        },
        delete: [
          'verify',
          async () => {
            const { id } = req.body;
            const deletedAssociation = await deleteAssociation(id);

            if (deletedAssociation)
              return {
                message: 'Association deleted',
                deletedAssociation
              };

            throw new Error(
              JSON.stringify({
                errorkey: 'delete',
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
