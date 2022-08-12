import { prisma } from '../prisma';

// Create Association
export const createAssociation = async (data) => {
    const { userId, tenantId, ...rest } = data;

    if (userId) rest.user = { connect: { id: userId } };
    if (tenantId) rest.tenant = { connect: { id: tenantId } };
    const association = await prisma.associations.create({ data });

    return association;
};

// Read Association
export const getAssociation = async ({ id, userId, tenantId, approval }) => {
    if (!id && !userId && !tenantId && approval === undefined) {
        const associations = await prisma.associations.findMany();
        return associations;
    }

    const query = { OR: [] };

    if (id) query.OR.push({ id });
    if (userId) query.OR.push({ userId });
    if (tenantId) query.OR.push({ tenantId });
    if (approval !== undefined) query.OR.push({ approval });

    const association = await prisma.associations.findMany({
        where: query
    });

    return association;
};

// Update Association
export const updateAssociation = async (id, updateData) => {
    const { userId, tenantId, ...rest } = updateData;

    if (userId) rest.user = { connect: { id: userId } };
    if (tenantId) rest.tenant = { connect: { id: tenantId } };

    const association = await prisma.associations.update({
        where: { id },
        data: updateData
    });

    return association;
};

// Delete Association
export const deleteAssociation = async (id) => {
    const deletedAssociation = await prisma.associations.delete({
        where: { id }
    });

    return deletedAssociation;
};
