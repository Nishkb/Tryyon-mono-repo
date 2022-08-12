import { prisma } from '../prisma';

// Create Tenant
export const createTenant = async (data) => {
    const { companyId, ...rest } = data;

    rest.company = { connect: { id: companyId } };

    const tenant = await prisma.tenant.create({
        data: rest,
        include: {
            company: true
        }
    });

    return tenant;
};

// Read Tenant
export const getTenant = async ({ id, companyId }) => {
    if (!id && !companyId) return [];

    const query = { OR: [] };

    if (id) query.OR.push({ id });
    if (companyId) query.OR.push({ companyId });

    const tenant = await prisma.tenant.findMany({
        where: query,
        include: {
            company: true
        }
    });

    return tenant;
};

export const searchTenants = async ({ id, query, adminApproval }) => {
    const condition = {};

    if (id) condition.id = id;
    if (query) condition.name = { contains: query, mode: 'insensitive' };
    if (adminApproval !== undefined)
        condition.adminApproval = adminApproval == 'true';

    const tenants = await prisma.tenant.findMany({
        where: condition
    });

    return tenants;
};

export const searchTenantsPaginated = async ({
    id,
    query,
    adminApproval,
    count,
    offset
}) => {
    const condition = {};

    if (id) condition.id = id;
    if (query) condition.name = { contains: query, mode: 'insensitive' };
    if (adminApproval !== undefined)
        condition.adminApproval = adminApproval == 'true';

    const [tenants, total_count] = await prisma.$transaction([
        prisma.tenant.findMany({
            skip: offset,
            take: count,
            where: condition
        }),
        prisma.tenant.count({
            where: condition
        })
    ]);

    const pagination = {
        offset,
        count,
        total_count
    };

    return { tenants, pagination };
};

// Update Tenant
export const updateTenant = async (id, updateData) => {
    const { companyId, ...rest } = updateData;

    if (companyId) rest.company = { connect: { id: companyId } };

    const tenant = await prisma.tenant.update({
        where: { id },
        data: { ...rest },
        include: {
            company: true
        }
    });

    return tenant;
};

// Delete Tenant
export const deleteTenant = async (id) => {
    const deletedTenant = await prisma.tenant.delete({
        where: { id }
    });

    return deletedTenant;
};
