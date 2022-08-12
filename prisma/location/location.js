import { prisma } from '../prisma';

// Create Location
export const createLocation = async (data) => {
    const { tenantId, ...rest } = data;

    rest.tenant = { connect: { id: tenantId } };

    const location = await prisma.location.create({
        data: rest,
        include: {
            tenant: true
        }
    });

    return location;
};

// Read Location
export const getLocation = async ({ id, tenantId }) => {
    if (!id && !tenantId) return [];

    const query = { OR: [] };

    if (id) query.OR.push({ id });
    if (tenantId) query.OR.push({ tenantId });

    const location = await prisma.location.findMany({
        where: query,
        include: {
            tenant: true
        }
    });

    return location;
};

export const searchLocations = async ({
    id,
    ownerId,
    query,
    pincode,
    state,
    country,
    tenantId,
    paginated,
    count,
    offset
}) => {
    const condition = {};

    if (id) condition.id = id;
    if (query) {
        condition.OR = [
            { name: { contains: query, mode: 'insensitive' } },
            { address: { contains: query, mode: 'insensitive' } }
        ];
    }

    if (pincode) condition.pincode = pincode;
    if (state) condition.state = state;
    if (country) condition.country = country;
    if (tenantId) condition.tenantId = tenantId;
    if (ownerId) condition.tenant = { company: { ownerId } };

    if (paginated === true) {
        const [locations, total_count] = await prisma.$transaction([
            prisma.location.findMany({
                skip: offset,
                take: count,
                where: condition
            }),
            prisma.location.count({
                where: condition
            })
        ]);

        const pagination = {
            offset,
            count,
            total_count
        };

        return { locations, pagination };
    }

    const locations = await prisma.location.findMany({
        where: condition
    });

    return locations;
};

// Update Location
export const updateLocation = async (id, updateData) => {
    const { tenantId, ...rest } = updateData;

    if (tenantId) rest.tenant = { connect: { id: tenantId } };

    const location = await prisma.location.update({
        where: { id },
        data: { ...rest },
        include: {
            tenant: true
        }
    });

    return location;
};

// Delete Location
export const deleteLocation = async (id) => {
    const deletedLocation = await prisma.location.delete({
        where: { id }
    });

    return deletedLocation;
};
