import async from 'async';
import Joi from 'joi';

import { getAssociation } from '../../../prisma/association/association';
import handleResponse from '../../../utils/helpers/handleResponse';
import runMiddleware from '../../../utils/helpers/runMiddleware';
import verifyToken from '../../../utils/middlewares/adminAuth';

const handler = async (req, res) => {
  await runMiddleware(req, res, verifyToken);
  if (req.method == 'GET') {
    async.auto(
      {
        read: [
          async () => {
            const associations = await getAssociation({});

            if (associations.length != 0)
              return { message: 'Associations found', associations };

            throw new Error(
              JSON.stringify({
                errorkey: 'read',
                body: {
                  status: 404,
                  data: {
                    message: 'No association found'
                  }
                }
              })
            );
          }
        ]
      },
      handleResponse(req, res, 'read')
    );
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
};

export default handler;
