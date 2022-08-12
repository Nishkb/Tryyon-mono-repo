import { prisma } from '../prisma';

// Create SKU
export const createSKU = async (data) => {
    const { productId, supplierId, categoryIds, ...rest } = data;

    if (productId) rest.product = { connect: { id: productId } };
    if (supplierId) rest.supplier = { connect: { id: supplierId } };
    if (categoryIds && categoryIds.length != 0) {
        rest.categories = { connect: [] };
        categoryIds.forEach((id) => {
            rest.categories.connect.push({ id });
        });
    }

    const sku = await prisma.sKU.create({
        data: rest
    });

    return sku;
};

export const bulkCreateSKU = async (dataArr) => {
    const res = [];

    for (let i = 0; i < dataArr.length; i++) {
        const data = dataArr[i];
        const { productId, supplierId, categoryIds, ...rest } = data;

        if (productId) rest.product = { connect: { id: productId } };
        if (supplierId) rest.supplier = { connect: { id: supplierId } };
        if (categoryIds && categoryIds.length != 0) {
            rest.categories = { connect: [] };
            categoryIds.forEach((id) => {
                rest.categories.connect.push({ id });
            });
        }

        const sku = await prisma.sKU.create({
            data: rest
        });

        res.push(sku);
    }

    return res;
};

// Read SKU
export const getSKU = async (id) => {
    const skus = await prisma.sKU.findMany({
        where: { id }
    });

    return skus;
};

export const searchSKUs = async ({
    id,
    inStock,
    published,
    priceFrom,
    priceTo,
    supplierId,
    attributes,
    categoryId,
    productId,
    pagination,
    offset,
    limit
}) => {
    const condition = { $and: [] },
        options = {};
    let total_count;

    if (attributes) {
        const attr = {};

        for (let prop in attributes) {
            attr[`attributes.${prop}`] = { $eq: attributes[prop] };
        }

        condition.$and.push(attr);
        console.log(attr);
    }

    if (id) condition.$and.push({ _id: { $eq: { $oid: id } } });

    if (supplierId)
        condition.$and.push({ supplierId: { $eq: { $oid: supplierId } } });

    if (priceFrom)
        condition.$and.push({ discountedPrice: { $gte: priceFrom } });

    if (priceTo) condition.$and.push({ discountedPrice: { $lte: priceTo } });

    if (productId)
        condition.$and.push({ productId: { $eq: { $oid: productId } } });

    if (inStock == true) condition.$and.push({ quantity: { $gt: 0 } });

    if (published != undefined) condition.$and.push({ published: published });

    if (categoryId)
        condition.$and.push({
            categoryIds: { $elemMatch: { $eq: { $oid: categoryId } } }
        });

    if (condition.$and.length == 0) {
        delete condition.$and;
    }

    if (pagination) {
        options.skip = offset;
        options.limit = limit;

        total_count = await prisma.$runCommandRaw({
            count: 'SKU',
            query: condition
        });
    }

    const skus = await prisma.sKU.findRaw({
        filter: condition,
        options
    });

    let res = skus.map((sku) => {
        let tmpId = sku._id.$oid;
        delete sku._id;
        sku.id = tmpId;

        let tmp = sku.supplierId.$oid;
        delete sku.supplierId;

        sku.supplierId = tmp;

        let tmpProductId = sku.productId.$oid;
        delete sku.productId;

        sku.productId = tmpProductId;

        let tmpArr = sku.categoryIds.map((e) => e.$oid);
        delete sku.categoryIds;

        sku.categoryIds = tmpArr;

        return sku;
    });

    if (pagination) {
        return {
            skus: res,
            pagination: {
                total_count: total_count.n,
                limit,
                offset
            }
        };
    }

    return res;
};

// Update SKU
export const updateSKU = async (id, updateData) => {
    const { productId, supplierId, categoryIds, ...rest } = updateData;

    if (productId) rest.product = { connect: { id: productId } };

    if (supplierId) rest.supplier = { connect: { id: supplierId } };

    if (categoryIds && categoryIds.length != 0) {
        rest.categories = { connect: [] };
        categoryIds.forEach((id) => {
            rest.categories.connect.push({ id });
        });
    }

    const product = await prisma.sKU.update({
        where: { id },
        data: rest
    });

    return product;
};

// Delete SKU
export const deleteSKU = async (id) => {
    const deletedSKU = await prisma.sKU.delete({
        where: { id }
    });

    return deletedSKU;
};
