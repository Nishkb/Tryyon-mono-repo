import { prisma } from '../prisma';

// Create Product
export const createProduct = async (data) => {
  const { supplierId, categoryIds, locationIds, ...rest } = data;

  if (supplierId) rest.supplier = { connect: { id: supplierId } };
  if (categoryIds && categoryIds.length != 0) {
    rest.categories = { connect: [] };
    categoryIds.forEach((id) => {
      rest.categories.connect.push({ id });
    });
  }

  if (locationIds && locationIds.length != 0) {
    rest.locations = { connect: [] };
    locationIds.forEach((id) => {
      rest.locations.connect.push({ id });
    });
  }

  const product = await prisma.product.create({
    data: rest
  });

  return product;
};

// Read Product
export const getProduct = async (id) => {
  const products = await prisma.product.findMany({
    where: { id }
  });

  return products;
};

export const searchProducts = async ({
  id,
  query,
  inStock,
  published,
  supplierId,
  attributes,
  priceFrom,
  priceTo,
  sortBy,
  order,
  categoryId,
  manufacturer,
  locationId,
  countryOfOrigin,
  trending,
  featuredFrom,
  featuredTo,
  guestCheckout,
  private_product,
  marketPlace,
  reseller,
  excludeTenant,
  pagination,
  offset,
  limit
}) => {
  const condition = {},
    sortProducts = {},
    pipeline = [];

  let total_count;

  if (attributes) {
    for (let prop in attributes) {
      condition[`attributes.${prop}`] = {
        $elemMatch: { $eq: attributes[prop] }
      };
    }
  }

  if (reseller) {
    for (let prop in reseller) {
      condition[`reseller.${prop}`] = { $eq: reseller[prop] };
    }
  }

  if (id) condition._id = { $eq: { $oid: id } };
  if (supplierId) condition.supplierId = { $eq: { $oid: supplierId } };
  if (excludeTenant)
    condition.supplierId = {
      ...condition.supplierId,
      $ne: { $oid: excludeTenant }
    };
  if (query) condition.name = { $regex: query, $options: 'i' };
  if (manufacturer)
    condition.manufacturer = { $regex: manufacturer, $options: 'i' };
  if (countryOfOrigin)
    condition.countryOfOrigin = { $regex: countryOfOrigin, $options: 'i' };

  if (featuredFrom && featuredTo) {
    condition.$expr = {
      $and: [
        {
          $gte: [
            '$featuredFrom',
            { $dateFromString: { dateString: featuredFrom } }
          ]
        },
        {
          $lte: ['$featuredTo', { $dateFromString: { dateString: featuredTo } }]
        }
      ]
    };
  } else {
    if (featuredFrom)
      condition.$expr = {
        $gte: [
          '$featuredFrom',
          { $dateFromString: { dateString: featuredFrom } }
        ]
      };
    if (featuredTo)
      condition.$expr = {
        $lte: ['$featuredTo', { $dateFromString: { dateString: featuredTo } }]
      };
  }

  if (inStock == true) condition.quantity = { $gt: 0 };
  else if (inStock == false) condition.quantity = { $eq: 0 };

  if (published != undefined) condition.published = published;
  if (trending != undefined) condition.trending = trending;
  if (guestCheckout != undefined) condition.guestCheckout = guestCheckout;
  if (private_product != undefined) condition.private_product = private_product;
  if (marketPlace != undefined) condition.marketPlace = marketPlace;

  if (categoryId)
    condition.categoryIds = { $elemMatch: { $eq: { $oid: categoryId } } };

  if (locationId)
    condition.locationIds = { $elemMatch: { $eq: { $oid: locationId } } };

  if (sortBy) {
    sortProducts[sortBy] = order == 'desc' ? -1 : 1;
  }

  pipeline.push({ $match: condition });
  pipeline.push({
    $lookup: {
      from: 'Category',
      localField: 'categoryIds',
      foreignField: '_id',
      as: 'categories'
    }
  });

  pipeline.push({
    $lookup: {
      from: 'Location',
      localField: 'locationIds',
      foreignField: '_id',
      as: 'locations'
    }
  });

  pipeline.push({
    $lookup: {
      from: 'SKU',
      localField: '_id',
      foreignField: 'productId',
      as: 'sku'
    }
  });

  pipeline.push({
    $lookup: {
      from: 'ProductImports',
      localField: '_id',
      foreignField: 'productId',
      as: 'productImport'
    }
  });

  if (excludeTenant) {
    pipeline.push({
      $match: {
        productImport: {
          $not: {
            $elemMatch: {
              tenantId: {
                $eq: {
                  $oid: excludeTenant
                }
              }
            }
          }
        }
      }
    });
  }

  if (priceFrom || priceTo) {
    const price = {};
    if (priceFrom) price.$gte = priceFrom;
    if (priceTo) price.$lte = priceTo;

    pipeline.push({
      $match: {
        sku: {
          $elemMatch: {
            price
          }
        }
      }
    });
  }

  if (Object.keys(sortProducts).length !== 0)
    pipeline.push({ $sort: sortProducts });

  if (pagination) {
    if (offset) pipeline.push({ $skip: offset });
    if (limit) pipeline.push({ $limit: limit });

    total_count = await prisma.$runCommandRaw({
      count: 'Product',
      query: condition
    });
  }

  pipeline.push({
    $project: {
      _id: 1,
      name: 1,
      description: 1,
      shortDescriptions: 1,
      slug: 1,
      quantity: 1,
      supplierId: 1,
      published: 1,
      attributes: 1,
      reseller: 1,
      categoryIds: 1,
      'categories.name': 1,
      'categories.description': 1,
      'categories.slug': 1,
      'locations.name': 1,
      'locations.address': 1,
      'locations.state': 1,
      'locations.country': 1,
      manufacturer: 1,
      locationIds: 1,
      countryOfOrigin: 1,
      trending: 1,
      featuredFrom: 1,
      featuredTo: 1,
      guestCheckout: 1,
      private_product: 1,
      marketPlace: 1,
      images: 1
    }
  });

  const products = await prisma.product.aggregateRaw({
    pipeline
  });

  let res = products.map((product) => {
    let tmpId = product._id.$oid;
    delete product._id;
    product.id = tmpId;

    if (product.supplierId) {
      let tmp = product.supplierId.$oid;
      delete product.supplierId;

      product.supplierId = tmp;
    }

    if (Array.isArray(product.categoryIds)) {
      let tmpArr = product.categoryIds.map((e) => e.$oid);
      delete product.categoryIds;

      product.categoryIds = tmpArr;
    }

    if (Array.isArray(product.locationIds)) {
      let tmpArr = product.locationIds.map((e) => e.$oid);
      delete product.locationIds;

      product.locationIds = tmpArr;
    }

    if (product.featuredFrom) {
      let tmpFeaturedFrom = product.featuredFrom.$date;
      delete product.featuredFrom;

      product.featuredFrom = tmpFeaturedFrom;
    }

    if (product.featuredTo) {
      let tmpFeaturedTo = product.featuredTo.$date;
      delete product.featuredTo;

      product.featuredTo = tmpFeaturedTo;
    }

    return product;
  });

  if (pagination) {
    return {
      products: res,
      pagination: {
        total_count: total_count.n,
        limit,
        offset
      }
    };
  }

  return res;
};

// Update Product
export const updateProduct = async (id, updateData) => {
  const { supplierId, categoryIds, locationIds, ...rest } = updateData;

  if (supplierId) rest.supplier = { connect: { id: supplierId } };

  if (categoryIds && categoryIds.length != 0) {
    rest.categories = { connect: [] };
    categoryIds.forEach((id) => {
      rest.categories.connect.push({ id });
    });
  }

  if (locationIds && locationIds.length != 0) {
    rest.locations = { connect: [] };
    locationIds.forEach((id) => {
      rest.locations.connect.push({ id });
    });
  }

  const product = await prisma.product.update({
    where: { id },
    data: rest
  });

  return product;
};

// Delete Product
export const deleteProduct = async (id) => {
  const deletedProduct = await prisma.product.delete({
    where: { id }
  });

  return deletedProduct;
};
