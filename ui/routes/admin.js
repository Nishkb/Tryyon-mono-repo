import React from 'react';

import { Icon } from '@chakra-ui/react';
import {
    MdHome,
    MdBarChart,
    MdEditAttributes,
    MdShoppingBag,
    MdApartment
} from 'react-icons/md';

const routes = [
    {
        name: 'Dashboard',
        layout: '/admin',
        path: '/default',
        icon: <Icon as={MdHome} width="20px" height="20px" color="inherit" />
    },
    {
        name: 'Categories',
        layout: '/admin',
        path: '/category',
        icon: (
            <Icon as={MdBarChart} width="20px" height="20px" color="inherit" />
        )
    },
    {
        name: 'Attributes',
        layout: '/admin',
        path: '/attributes',
        icon: (
            <Icon
                as={MdEditAttributes}
                width="20px"
                height="20px"
                color="inherit"
            />
        )
    },
    {
        name: 'Products',
        layout: '/admin',
        path: '/products',
        icon: (
            <Icon
                as={MdShoppingBag}
                width="20px"
                height="20px"
                color="inherit"
            />
        )
    },
    {
        name: 'Tenants',
        layout: '/admin',
        path: '/tenants',
        icon: (
            <Icon as={MdApartment} width="20px" height="20px" color="inherit" />
        )
    }
];

export default routes;
