import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import async from 'async';
import Joi from 'joi';
import { uuid } from 'uuidv4';

import {
  createAdmin,
  getAdmin,
  updateAdmin
} from '../../../prisma/admin/admin';
import validate from '../../../utils/middlewares/validation';
import handleResponse from '../../../utils/helpers/handleResponse';
import transporter from '../../../utils/mail/transporter';

const schema = {
  body: Joi.object({
    username: Joi.string().required(),
    firstname: Joi.string().required(),
    lastname: Joi.string().required(),
    phone: Joi.number().min(1000000000).max(9999999999).required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    role: Joi.string()
  })
};

const handler = async (req, res) => {
  if (req.method == 'POST') {
    async.auto(
      {
        verification: async () => {
          const { email, username, phone } = req.body;
          const adminCheck = await getAdmin({
            username,
            email,
            phone
          });

          if (adminCheck.length != 0) {
            throw new Error(
              JSON.stringify({
                errorkey: 'verification',
                body: {
                  status: 409,
                  data: {
                    message: 'Admin User Already Exists'
                  }
                }
              })
            );
          }

          return {
            message: 'New Admin Validated'
          };
        },
        register: [
          'verification',
          async () => {
            const { body } = req;
            body.passwordHash = await bcrypt.hash(body.password, 10);
            delete body.password;

            const createdAdmin = await createAdmin(body);

            if (createdAdmin) {
              const token = jwt.sign(
                {
                  id: createdAdmin.id,
                  email: createdAdmin.email,
                  role: createdAdmin.role
                },
                process.env.ADMIN_TOKEN_KEY,
                { expiresIn: '2h' }
              );

              const verificationCode = uuid();
              const verificationExpiry = new Date(
                new Date().getTime() + 48 * 60 * 60 * 1000
              );

              const admin = await updateAdmin(createdAdmin.id, {
                token,
                verificationCode,
                verificationExpiry
              });
              return { message: 'New admin registered', admin };
            }
            throw new Error(
              JSON.stringify({
                errorkey: 'register',
                body: {
                  status: 500,
                  data: {
                    message: 'Internal Server Error'
                  }
                }
              })
            );
          }
        ],
        email: [
          'register',
          async (results) => {
            const { admin } = results.register;

            if (admin) {
              const mailOptions = {
                from: `"Tryyon" <${process.env.MAIL_USERNAME}>`,
                to: admin.email,
                subject: 'Verify your account',
                text: `Please click this link to verify your mail: ${
                  process.env.BASE_URL +
                  '/api/admin/verify?code=' +
                  admin.verificationCode
                }`
              };

              const info = await transporter.sendMail(mailOptions);

              console.log(info);
              if (info.rejected.length != 0) {
                throw new Error(
                  JSON.stringify({
                    errorkey: 'email',
                    body: {
                      status: 500,
                      data: {
                        message: 'Verification mail not sent'
                      }
                    }
                  })
                );
              }

              return {
                message: 'Verification email sent'
              };
            }

            throw new Error(
              JSON.stringify({
                errorkey: 'email',
                body: {
                  status: 500,
                  data: {
                    message: 'Internal server error'
                  }
                }
              })
            );
          }
        ]
      },
      handleResponse(req, res, 'register')
    );
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
};

export default validate(schema, handler);
