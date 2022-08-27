import { prisma } from '../prisma';

// Create Cart
export const createCart = async (data) => {
    const { skuIds, ...rest } = data;
    rest.skus = { connect: [] };

    if (skuIds && Array.isArray(skuIds)) {
        rest.skus = { connect: [] };
        skuIds.forEach((skuId) => {
            rest.skus.connect.push({ id: skuId });
        });
    }

    const cart = await prisma.cart.create({
        data: rest
    });

    return cart;
};

// Read Cart
export const getCart = async ({ id, uid, checkedOut }) => {
    if (!id && !uid && checkedOut === undefined) return [];

    const query = { OR: [] };

    if (id) query.OR.push({ id });
    if (uid) query.OR.push({ uid });
    if (checkedOut != undefined)
        query.OR.push({ checkedOut: checkedOut == 'true' });

    const cart = await prisma.cart.findMany({
        where: query,
        include: {
            skus: true
        }
    });

    return cart;
};

export const searchCarts = async ({ id, uid, checkedOut }) => {
    const condition = {};

    if (id) condition.id = id;
    if (uid) condition.uid = uid;
    if (checkedOut != undefined) condition.checkedOut = checkedOut == 'true';

    const carts = await prisma.cart.findMany({
        where: condition,
        include: {
            skus: true
        }
    });

    return carts;
};

// Update Cart
export const updateCart = async (id, updateData) => {
    const cart = await prisma.cart.update({
        where: { id },
        data: updateData,
        include: {
            skus: true
        }
    });

    return cart;
};

/// Manage SKUs
export const addSKU = async (id, skuIds) => {
    const cart = await prisma.cart.update({
        where: { id },
        data: {
            skus: {
                connect: skuIds.map((id) => ({ id }))
            },
            lastUpdated: new Date(Date.now()).toISOString()
        },
        include: {
            skus: true
        }
    });

    return cart;
};

export const removeSKU = async (id, skuIds) => {
    const cart = await prisma.cart.update({
        where: { id },
        data: {
            skus: {
                disconnect: skuIds.map((id) => ({ id }))
            },
            lastUpdated: new Date(Date.now()).toISOString()
        },
        include: {
            skus: true
        }
    });

    return cart;
};
