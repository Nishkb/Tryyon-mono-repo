import { prisma } from '../prisma';

// create
export const createAttribute = async (data) => {
    const attribute = await prisma.attribute.create({ data });

    return attribute;
};

// read
export const getAttribute = async ({ id }) => {
    if (!id) return [];

    const attributes = await prisma.attribute.findMany({
        where: { id }
    });

    return attributes;
};

export const searchAttribute = async ({ id, query }) => {
    if (!id && !query) {
        const attributes = await prisma.attribute.findMany();
        return attributes;
    }

    const condition = { OR: [] };

    if (id) condition.OR.push({ id });
    if (query)
        condition.OR.push({
            name: {
                contains: query,
                mode: 'insensitive'
            }
        });

    const attributes = await prisma.attribute.findMany({
        where: condition
    });

    return attributes;
};

// update
export const updateAttribute = async (id, updateData) => {
    const attribute = await prisma.attribute.update({
        where: { id },
        data: updateData
    });

    return attribute;
};

// delete
export const deleteAttribute = async (id) => {
    const attribute = await prisma.attribute.delete({
        where: { id }
    });

    return attribute;
};
