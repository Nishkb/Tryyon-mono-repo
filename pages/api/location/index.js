import async from 'async';

import handleResponse from '../../../utils/helpers/handleResponse';
import auth from '../../../utils/middlewares/auth';
import runMiddleware from '../../../utils/helpers/runMiddleware';
import { searchLocations } from '../../../prisma/location/location';

const handler = async (req, res) => {
    await runMiddleware(req, res, auth);
    if (req.method == 'GET') {
        async.auto(
            {
                read: [
                    async () => {
                        const { paginated, count, offset, ...rest } = req.query;

                        if (paginated == 'true') {
                            if (!count || !offset)
                                throw new Error(
                                    JSON.stringify({
                                        errorKey: 'read',
                                        body: {
                                            status: 422,
                                            data: {
                                                message:
                                                    'Missing query parameter, both count and offset need with paginated'
                                            }
                                        }
                                    })
                                );
                            else {
                                rest.paginated = paginated == 'true';
                                rest.count = parseInt(count, 10);
                                rest.offset = parseInt(offset, 10);
                            }
                        }

                        if (!req.admin) {
                            // non admin user
                            const ownerId = req.user.id;
                            rest.ownerId = ownerId;
                        }

                        const locations = await searchLocations(rest);

                        if (locations.length != 0) {
                            return {
                                message: 'Locations found',
                                locations
                            };
                        }

                        throw new Error(
                            JSON.stringify({
                                errorKey: 'read',
                                body: {
                                    status: 404,
                                    data: {
                                        message: 'No Locations Found'
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
