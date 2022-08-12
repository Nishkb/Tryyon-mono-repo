import { prisma } from '../prisma';

// Create Role
export const createRole = async (data) => {
    const role = await prisma.role.create({
        data: data
    });

    return role;
};

// Read Role
export const getRoles = async () => {
    const roles = await prisma.role.findMany();

    return roles;
};

export const getRole = async ({ id, title }) => {
    let role;

    if (id)
        role = await prisma.role.findUnique({
            where: { id }
        });
    else if (title)
        role = await prisma.role.findUnique({
            where: { title }
        });

    return role;
};

export const checkRole = async ({ id, title }) => {
    let role;

    if (id)
        role = await prisma.role.findMany({
            where: { id }
        });
    else if (title)
        role = await prisma.role.findMany({
            where: { title }
        });

    return role;
};

export const getRoleWithAdmins = async ({ id, title }) => {
    let role;

    if (id)
        role = await prisma.role.findUnique({
            where: { id },
            include: {
                admins: true
            }
        });
    else if (title)
        role = await prisma.role.findUnique({
            where: { title },
            include: {
                admins: true
            }
        });

    return role;
};

// Update Role
export const updateRole = async (id, updateData) => {
    const role = await prisma.role.update({
        where: { id },
        data: { ...updateData }
    });

    return role;
};

// Delete Role
export const deleteRole = async ({ id, title }) => {
    let deletedRole;
    if (id)
        deletedRole = await prisma.role.delete({
            where: { id }
        });
    else if (title)
        deletedRole = await prisma.role.delete({
            where: { title }
        });

    return deletedRole;
};
