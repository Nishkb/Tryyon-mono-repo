// Startup script to create a default admin user if now already present in database

import { createAdmin, getAdminByEmail } from '../prisma/user-master/admin';
import bcrypt from 'bcryptjs';

const init = async () => {
    const admin = await getAdminByEmail(process.env.DEFAULT_ADMIN_EMAIL);

    const passwordHash = await bcrypt.hash(process.env.DEFAULT_ADMIN_PASS, 10);

    if (!admin) {
        const defaultAdmin = await createAdmin({
            username: 'admin',
            firstname: 'admin',
            lastname: 'user',
            email: process.env.DEFAULT_ADMIN_EMAIL,
            phone: 9876543210,
            passwordHash: passwordHash
        });

        return {
            message: 'Default admin created',
            defaultAdmin
        };
    } else {
        return {
            message: 'Default admin already exists',
            admin
        };
    }
};

export default init;
