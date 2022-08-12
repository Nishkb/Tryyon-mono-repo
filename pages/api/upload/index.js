import async from 'async';

import handleResponse from '../../../utils/helpers/handleResponse';
import runMiddleware from '../../../utils/helpers/runMiddleware';
import auth from '../../../utils/middlewares/auth';
import aws from 'aws-sdk';
import multer from 'multer';
import multerS3 from 'multer-s3';

export const config = {
    api: {
        bodyParser: false
    }
};

const spacesEndpoint = new aws.Endpoint(process.env.SPACES_ENDPOINT);

const s3 = new aws.S3({
    endpoint: spacesEndpoint,
    credentials: {
        accessKeyId: process.env.SPACES_ACCESS_KEY,
        secretAccessKey: process.env.SPACES_SECRET
    }
});

const uploadHandler = multer({
    storage: multerS3({
        s3,
        bucket: `tryyon-files`,
        acl: 'public-read',
        key: (req, file, cb) => {
            cb(null, `${Date.now().toString()}-${file.originalname}`);
        }
    })
}).single('image');

const handler = async (req, res) => {
    await runMiddleware(req, res, auth);
    await runMiddleware(req, res, uploadHandler);

    if (req.method == 'POST') {
        async.auto(
            {
                upload: [
                    async () => {
                        if (!req.file) {
                            throw new Error(
                                JSON.stringify({
                                    errorkey: 'upload',
                                    body: {
                                        status: 500,
                                        data: {
                                            message:
                                                'Error while uploading files'
                                        }
                                    }
                                })
                            );
                        }

                        return {
                            message: 'Success',
                            body: req.file
                        };
                    }
                ]
            },
            handleResponse(req, res, 'upload')
        );
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
};

export default handler;
