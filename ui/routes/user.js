import React from 'react';

import { Icon } from '@chakra-ui/react';
import { MdHome, MdShoppingBag } from 'react-icons/md';

const routes = [
    {
        name: 'Dashboard',
        layout: '',
        path: '/dashboard',
        icon: <Icon as={MdHome} width="20px" height="20px" color="inherit" />
    },
    {
        name: 'Products',
        layout: '',
        path: '/products',
        icon: (
            <Icon
                as={MdShoppingBag}
                width="20px"
                height="20px"
                color="inherit"
            />
        ),
        items: [
            {
                name: 'Browse',
                layout: '/products',
                path: '/browse'
            }
        ]
    }
];

export default routes;
