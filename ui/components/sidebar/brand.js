import React from 'react';

// Chakra imports
import {
    Flex,
    useColorMode,
    useColorModeValue,
    Button,
    Icon
} from '@chakra-ui/react';

// Custom components
import { HorizonLogo } from '../icons/Icons';
import { HSeparator } from '../separator/Separator';
import { IoMdMoon, IoMdSunny } from 'react-icons/io';

export function SidebarBrand() {
    //   Chakra color mode
    const { colorMode, toggleColorMode } = useColorMode();
    let logoColor = useColorModeValue('navy.700', 'white');
    const navbarIcon = useColorModeValue('gray.400', 'white');
    let brandColor = useColorModeValue('brand.500', 'brand.400');

    return (
        <>
            <Flex align="center" direction="column">
                <HorizonLogo h="26px" w="175px" my="32px" color={logoColor} />
                <HSeparator mb="20px" />
            </Flex>
            <Flex
                position="absolute"
                top="80vh"
                left="0px"
                p="20px"
                bg={brandColor}
                borderTopRightRadius="3xl"
                borderBottomRightRadius="3xl"
                onClick={toggleColorMode}
            >
                <Button
                    variant="no-hover"
                    bg="transparent"
                    p="0px"
                    minW="unset"
                    minH="unset"
                    h="18px"
                    w="max-content"
                >
                    <Icon
                        h="18px"
                        w="18px"
                        color={navbarIcon}
                        as={colorMode === 'light' ? IoMdMoon : IoMdSunny}
                    />
                </Button>
            </Flex>
        </>
    );
}

export default SidebarBrand;
