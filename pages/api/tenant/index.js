import async from 'async';

import {
    searchTenants,
    searchTenantsPaginated
} from '../../../prisma/tenant/tenant';
import handleResponse from '../../../utils/helpers/handleResponse';
import { prisma } from '../../../prisma/prisma';
import auth from '../../../utils/middlewares/auth';
import runMiddleware from '../../../utils/helpers/runMiddleware';

const handler = async (req, res) => {
    await runMiddleware(req, res, auth);
    if (req.method == 'GET') {
        async.auto(
            {
                read: [
                    async () => {
                        if (!req.admin) {
                            // non admin user
                            const ownerId = req.user.id;
                            const tenant = await prisma.tenant.findMany({
                                where: {
                                    company: {
                                        ownerId
                                    }
                                }
                            });

                            if (tenant.length != 0) {
                                return {
                                    message: 'Tenant found',
                                    tenant: tenant[0]
                                };
                            }

                            throw new Error(
                                JSON.stringify({
                                    errorkey: 'read',
                                    body: {
                                        status: 404,
                                        data: {
                                            message:
                                                'User does not have a tenant'
                                        }
                                    }
                                })
                            );
                        }

                        // admin user
                        const { paginated, count, offset, ...rest } = req.query;

                        if (paginated == 'true' && (!count || !offset)) {
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
                        }

                        if (paginated) {
                            const tenants = await searchTenantsPaginated({
                                offset: Number(offset),
                                count: Number(count),
                                ...rest
                            });

                            if (tenants.tenants.length != 0) {
                                return {
                                    message: 'Tenants found',
                                    tenants
                                };
                            }
                        } else {
                            const tenants = await searchTenants(rest);

                            if (tenants.length != 0) {
                                return {
                                    message: 'Tenants found',
                                    tenants
                                };
                            }
                        }

                        throw new Error(
                            JSON.stringify({
                                errorKey: 'read',
                                body: {
                                    status: 404,
                                    data: {
                                        message: 'No Tenant found'
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
