import { prisma } from '../prisma';

// create
export const createProductImport = async (data) => {
    const { tenantId, productId, skuIds, ...rest } = data;

    if (skuIds && Array.isArray(skuIds) && skuIds.length != 0) {
        rest.skus = { connect: [] };
        skuIds.forEach((id) => {
            rest.skus.connect.push({ id });
        });
    }
    if (tenantId) rest.tenant = { connect: { id: tenantId } };
    if (productId) rest.product = { connect: { id: productId } };

    const productImport = await prisma.productImports.create({
        data: rest,
        include: {
            product: true
        }
    });

    return productImport;
};

// read
export const getProductImport = async ({
    id,
    tenantId,
    productId,
    type,
    skuId
}) => {
    if (!id && !tenantId && !productId && !type && !skuId) return [];

    const condition = { OR: [] };

    if (id) condition.OR.push({ id });
    if (tenantId) condition.OR.push({ tenantId });
    if (skuId) condition.OR.push({ skuIds: { contains: skuId } });
    if (productId) condition.OR.push({ productId });
    if (type) condition.OR.push({ type });

    const productImports = await prisma.productImports.findMany({
        where: condition
    });

    return productImports;
};

export const searchProductImport = async ({
    id,
    tenantId,
    productId,
    status,
    type,
    skuId,
    ownerId
}) => {
    if (
        !id &&
        !tenantId &&
        !productId &&
        status === undefined &&
        !type &&
        !skuId &&
        !ownerId
    ) {
        const productImports = await prisma.productImports.findMany({
            where: {},
            include: {
                product: true
            }
        });

        return productImports;
    }

    const condition = { AND: [] };

    if (id) condition.AND.push({ id });
    if (tenantId) condition.AND.push({ tenantId });
    if (productId) condition.AND.push({ productId });
    if (status != undefined) condition.AND.push({ status });
    if (skuId) condition.AND.push({ skuIds: { has: skuId } });
    if (type) condition.AND.push({ type });
    if (ownerId) condition.AND.push({ tenant: { company: { ownerId } } });

    const productImports = await prisma.productImports.findMany({
        where: condition,
        include: {
            product: true
        }
    });

    return productImports;
};

// update
export const updateProductImport = async (id, updateData) => {
    const { tenantId, productId, skuIds, ...rest } = updateData;

    if (tenantId) rest.tenant = { connect: { id: tenantId } };
    if (productId) rest.product = { connect: { id: productId } };
    if (skuIds && Array.isArray(skuIds) && skuIds.length != 0) {
        rest.skus = { connect: [] };
        skuIds.forEach((id) => {
            rest.skus.connect.push({ id });
        });
    }

    const productImport = await prisma.productImports.update({
        where: { id },
        data: rest
    });

    return productImport;
};

// delete
export const deleteProductImport = async (id) => {
    const productImport = await prisma.productImports.delete({
        where: { id }
    });

    return productImport;
};

// toggle status
export const toggleStatus = async (id) => {
    const productImport = await prisma.productImports.findMany({
        where: { id }
    });

    if (productImport.length == 0) {
        throw new Error(
            JSON.stringify({
                status: 409,
                message: 'Product Import ID is not valid'
            })
        );
    }

    const updatedProductImport = await prisma.productImports.update({
        where: { id },
        data: {
            status: !productImport[0].status
        }
    });

    return updatedProductImport;
};
