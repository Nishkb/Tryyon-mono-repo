import async from 'async';

import {
    searchCompanies,
    searchCompaniesPaginated,
    getCompany
} from '../../../prisma/company/company';
import handleResponse from '../../../utils/helpers/handleResponse';
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
                            // if a non admin authenticated user
                            const { id } = req.user;
                            const company = await getCompany({ ownerId: id });

                            if (company.length == 0) {
                                throw new Error(
                                    JSON.stringify({
                                        errorKey: 'read',
                                        body: {
                                            status: 404,
                                            data: {
                                                message:
                                                    'User does not have a company'
                                            }
                                        }
                                    })
                                );
                            }

                            return {
                                message: 'Company found',
                                company: company[0]
                            };
                        }

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

                        let companies;

                        if (paginated)
                            companies = await searchCompaniesPaginated({
                                offset: Number(offset),
                                count: Number(count),
                                ...rest
                            });
                        else companies = await searchCompanies(rest);

                        if (companies.length != 0) {
                            return {
                                message: 'Companies found',
                                companies
                            };
                        }

                        throw new Error(
                            JSON.stringify({
                                errorKey: 'read',
                                body: {
                                    status: 404,
                                    data: {
                                        message: 'No Company found'
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
