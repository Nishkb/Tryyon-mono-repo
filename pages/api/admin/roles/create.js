import async from 'async';
import Joi from 'joi';

import { checkRole, createRole } from '../../../../prisma/admin/roles';
import handleResponse from '../../../../utils/helpers/handleResponse';
import runMiddleware from '../../../../utils/helpers/runMiddleware';
import verifyToken from '../../../../utils/middlewares/adminAuth';
import validate from '../../../../utils/middlewares/validation';

const schema = {
  body: Joi.object({
    title: Joi.string().required()
  })
};

const handler = async (req, res) => {
  await runMiddleware(req, res, verifyToken);
  if (req.method == 'POST') {
    async.auto(
      {
        verify: async () => {
          const { title } = req.body;
          const roleCheck = await checkRole({ title });

          if (roleCheck.length != 0) {
            throw new Error(
              JSON.stringify({
                errorkey: 'verify',
                body: {
                  status: 409,
                  data: {
                    message: 'Role Already Exists'
                  }
                }
              })
            );
          }

          return {
            message: 'New Role Validated'
          };
        },
        create: [
          'verify',
          async () => {
            const { body } = req;
            const createdRole = await createRole(body);
            if (createdRole)
              return { message: 'New Role Created', createdRole };

            throw new Error(
              JSON.stringify({
                errorkey: 'create',
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
