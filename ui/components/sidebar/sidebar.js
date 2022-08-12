import React from 'react';

// chakra imports
import { Box, useColorModeValue } from '@chakra-ui/react';

import { renderThumb, renderTrack, renderView } from '../scrollbar/Scrollbar';
import { Scrollbars } from 'react-custom-scrollbars-2';
import PropTypes from 'prop-types';
import SidebarBrand from './brand';

function Sidebar(props) {
    const { children } = props;

    let variantChange = '0.2s linear';
    let shadow = useColorModeValue(
        '14px 17px 40px 4px rgba(112, 144, 176, 0.08)',
        'unset'
    );
    // Chakra Color Mode
    let sidebarBg = useColorModeValue('white', 'navy.800');
    let sidebarMargins = '0px';

    // SIDEBAR
    return (
        <Box display={{ sm: 'none', xl: 'block' }} position="fixed" minH="100%">
            <Box
                bg={sidebarBg}
                transition={variantChange}
                w="300px"
                h="100vh"
                m={sidebarMargins}
                minH="100%"
                overflowX="hidden"
                boxShadow={shadow}
            >
                {/* <SidebarBrand /> */}
                {children}
            </Box>
        </Box>
    );
}

// PROPS

Sidebar.propTypes = {
    logoText: PropTypes.string,
    routes: PropTypes.arrayOf(PropTypes.object),
    variant: PropTypes.string
};

export default Sidebar;
