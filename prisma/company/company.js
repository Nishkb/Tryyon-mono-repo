import { prisma } from '../prisma';

// Create Company
export const createCompany = async (data) => {
    const { ownerId, ...rest } = data;
    rest.owner = { connect: { id: ownerId } };

    const company = await prisma.company.create({
        data: rest
    });

    return company;
};

// Read Company
export const getCompany = async ({
    id,
    ownerId,
    gstNumber,
    panNumber,
    aadharNumber
}) => {
    if (!id && !gstNumber && !panNumber && !aadharNumber && !ownerId) return [];

    const query = { OR: [] };

    if (id) query.OR.push({ id });
    if (gstNumber) query.OR.push({ gstNumber });
    if (panNumber) query.OR.push({ panNumber });
    if (aadharNumber) query.OR.push({ aadharNumber });
    if (ownerId) query.OR.push({ ownerId });

    const company = await prisma.company.findMany({
        where: query,
        include: {
            tenant: true
        }
    });

    return company;
};

export const searchCompanies = async ({
    id,
    query,
    adminApproval,
    ownerId
}) => {
    const condition = {};

    if (id) condition.id = id;
    if (query) condition.name = { contains: query, mode: 'insensitive' };
    if (ownerId) condition.ownerId = ownerId;
    if (adminApproval != undefined)
        condition.adminApproval = adminApproval == 'true';

    const companies = await prisma.company.findMany({
        where: condition,
        include: {
            tenant: true
        }
    });

    return companies;
};

export const searchCompaniesPaginated = async ({
    id,
    query,
    adminApproval,
    ownerId,
    count,
    offset
}) => {
    const condition = {};

    if (id) condition.id = id;
    if (query) condition.name = { contains: query, mode: 'insensitive' };
    if (ownerId) condition.ownerId = ownerId;
    if (adminApproval != undefined)
        condition.adminApproval = adminApproval == 'true';

    const [companies, total_count] = await prisma.$transaction([
        prisma.company.findMany({
            skip: offset,
            take: count,
            where: condition,
            include: {
                tenant: true
            }
        }),
        prisma.company.count({
            where: condition
        })
    ]);

    const pagination = {
        offset,
        count,
        total_count
    };

    return { companies, pagination };
};

// Update Company
export const updateCompany = async (id, updateData) => {
    const { ownerId, ...rest } = updateData;
    if (ownerId) rest.owner = { connect: { id: ownerId } };

    const company = await prisma.company.update({
        where: { id },
        data: rest,
        include: {
            tenant: true
        }
    });

    return company;
};

// Delete Company
export const deleteCompany = async (id) => {
    const deletedCompany = await prisma.company.delete({
        where: { id }
    });

    return deletedCompany;
};
