import { prisma } from '../prisma';

// create
export const createCategory = async (data) => {
    if (!data.parentCategoryId) data.root = true;
    else {
        data.parentCategory = { connect: { id: data.parentCategoryId } };
        delete data.parentCategoryId;
        data.root = false;
    }

    const category = await prisma.category.create({
        data
    });

    return category;
};

// read
export const getCategory = async ({ id, isRoot, includeChildren }) => {
    if (!id && isRoot === undefined && includeChildren === undefined) return [];
    const condition = {};

    if (id) condition.id = id;
    if (isRoot !== undefined) condition.root = isRoot;
    if (includeChildren === undefined) includeChildren = false;

    const categories = await prisma.category.findMany({
        where: condition,
        include: {
            children: includeChildren
        }
    });

    return categories;
};

export const searchCategory = async ({
    id,
    query,
    isRoot,
    includeChildren
}) => {
    const condition = { AND: [] };

    if (id) condition.AND.push({ id });
    if (query)
        condition.AND.push({ name: { contains: query, mode: 'insensitive' } });
    if (isRoot) condition.AND.push({ root: isRoot == 'true' });

    if (!id && !query && !isRoot) {
        const categories = await prisma.category.findMany({
            where: {},
            include: {
                children: includeChildren == 'true'
            }
        });

        return categories;
    }

    const categories = await prisma.category.findMany({
        where: condition,
        include: {
            children: includeChildren == 'true'
        }
    });

    return categories;
};

// update
export const updateCategory = async (id, updateData) => {
    const { parentCategoryId, root } = updateData;

    if (root != undefined && root) {
        updateData.parentCategory = { disconnect: true };
    } else {
        updateData.parentCategory = { connect: { id: parentCategoryId } };
        delete updateData.parentCategoryId;
    }

    const category = await prisma.category.update({
        where: { id },
        data: updateData
    });

    return category;
};

// delete
export const deleteCategory = async (id) => {
    const category = await prisma.category.delete({
        where: { id }
    });

    return category;
};
