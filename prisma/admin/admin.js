import { prisma } from '../prisma';

// Create Admin
export const createAdmin = async (data) => {
    const { role } = data;
    if (role)
        data.role = {
            connectOrCreate: {
                where: { title: role },
                create: { title: role, adminRoles: [], tenantRoles: [] }
            }
        };

    const admin = await prisma.admin.create({ data });

    return admin;
};

// Read Admin
export const getAdmin = async ({
    id,
    username,
    email,
    phone,
    verificationCode,
    all
}) => {
    if (
        !id &&
        !username &&
        !email &&
        !phone &&
        !verificationCode &&
        all === undefined
    )
        return [];
    if (all !== undefined && all) {
        const admins = await prisma.admin.findMany({
            include: {
                role: true
            }
        });

        return admins;
    }

    const query = { OR: [] };
    if (id) query.OR.push({ id });
    if (username) query.OR.push({ username });
    if (email) query.OR.push({ email });
    if (phone) query.OR.push({ phone });
    if (verificationCode) query.OR.push({ verificationCode });

    const admins = await prisma.admin.findMany({
        where: query,
        include: {
            role: true
        }
    });

    return admins;
};

// Update Admin
export const updateAdmin = async (id, updateData) => {
    const { role } = updateData;
    if (role)
        updateData.role = {
            connectOrCreate: {
                where: { title: role },
                create: { title: role, adminRoles: [], tenantRoles: [] }
            }
        };

    const admin = await prisma.admin.update({
        where: { id },
        data: updateData,
        include: {
            role: true
        }
    });

    return admin;
};

// Delete Admin
export const deleteAdmin = async (id) => {
    const deletedUser = await prisma.admin.deleteMany({
        where: { id }
    });

    return deletedUser;
};
