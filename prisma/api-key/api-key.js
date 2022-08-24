import { prisma } from '../prisma';

// Create APIKey
export const createAPIKey = async (data) => {
    const { tenantId, ...rest } = data;

    if (tenantId) rest.tenant = { connect: { id: tenantId } };
    const apiKey = await prisma.apiKey.create({ data });

    return apiKey;
};

// Read APIKey
export const getAPIKey = async ({ id, tenantId, APIKey }) => {
    if (!id && !APIKey && !tenantId) {
        return [];
    }

    const query = { OR: [] };

    if (id) query.OR.push({ id });
    if (APIKey) query.OR.push({ APIKey });
    if (tenantId) query.OR.push({ tenantId });

    const apiKey = await prisma.apiKey.findMany({
        where: query
    });

    return apiKey;
};

export const searchAPIKey = async ({
    id,
    tenantId,
    APIKey,
    status,
    isValid,
    ownerId
}) => {
    const query = { AND: [] };

    if (id) query.AND.push({ id });
    if (APIKey) query.AND.push({ APIKey });
    if (tenantId) query.AND.push({ tenantId });
    if (status !== undefined) query.AND.push({ status: status === 'true' });
    if (isValid === 'true') {
        let currTime = new Date(new Date().getTime()).toISOString();
        query.AND.push({
            OR: [
                { validTill: { gte: currTime } },
                { validTill: { isSet: false } }
            ]
        });
    }
    if (ownerId) query.AND.push({ tenant: { company: { ownerId } } });

    const apiKeys = await prisma.apiKey.findMany({
        where: query
    });

    return apiKeys;
};

// Update APIKey
export const updateAPIKey = async (id, updateData) => {
    const { tenantId, ...rest } = updateData;

    if (tenantId) rest.tenant = { connect: { id: tenantId } };

    const apiKey = await prisma.apiKey.update({
        where: { id },
        data: updateData
    });

    return apiKey;
};

// Delete APIKey
export const deleteAPIKey = async (id) => {
    const deletedAPIKey = await prisma.apiKey.delete({
        where: { id }
    });

    return deletedAPIKey;
};
