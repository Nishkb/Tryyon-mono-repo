import React from 'react';

// Chakra imports
import { useColorModeValue } from '@chakra-ui/react';

// Custom components
import Layout from '../ui/layouts/user';

// Assets
import { useRouter } from 'next/router.js';
import { useEffect } from 'react';

function Dash() {
    // Chakra color mode
    // const textColor = useColorModeValue('navy.700', 'white');
    // const textColorSecondary = 'gray.400';
    // const textColorDetails = useColorModeValue('navy.700', 'secondaryGray.600');
    // const brandStars = useColorModeValue('brand.500', 'brand.400');

    let router = useRouter();

    useEffect(() => {
        if (!sessionStorage.userToken) {
            alert('Login first !');
            router.push('/auth/login');
        } else if (!sessionStorage.company) {
            alert('Register your company first');
            router.push('/auth/create/company');
        } else if (!sessionStorage.tenant) {
            alert('Register your tenant first');
            router.push('/auth/create/tenant');
        }
    });

    return <Layout>Dashboard</Layout>;
}

export default Dash;
