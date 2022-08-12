/* eslint-disable */
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
// chakra imports
import { Box, Flex, HStack, Text, useColorModeValue } from '@chakra-ui/react';

export function SidebarLinks(props) {
    //   Chakra color mode
    let router = useRouter();
    let activeColor = useColorModeValue('gray.700', 'white');
    let inactiveColor = useColorModeValue(
        'secondaryGray.600',
        'secondaryGray.600'
    );
    let activeIcon = useColorModeValue('brand.500', 'white');
    let textColor = useColorModeValue('secondaryGray.500', 'white');
    let brandColor = useColorModeValue('brand.500', 'brand.400');

    const { routes } = props;

    // verifies if routeName is the one active (in browser input)
    const activeRoute = (routeName) => {
        return router.pathname === routeName;
    };

    // this function creates the links from the secondary accordions (for example auth -> sign-in -> default)
    const createLinks = (routes) => {
        return routes.map((route, index) => {
            return (
                <Box key={index}>
                    <Link key={index} href={route.layout + route.path}>
                        <a>
                            {route.icon ? (
                                <Box borderLeft="2px" borderColor="gray.300">
                                    <HStack
                                        spacing={
                                            activeRoute(
                                                route.layout.toLowerCase() +
                                                    route.path.toLowerCase()
                                            )
                                                ? '22px'
                                                : '26px'
                                        }
                                        py="5px"
                                        ps="10px"
                                    >
                                        <Flex w="100%" alignItems="center">
                                            <Box
                                                color={
                                                    activeRoute(
                                                        route.layout.toLowerCase() +
                                                            route.path.toLowerCase()
                                                    )
                                                        ? activeIcon
                                                        : textColor
                                                }
                                                me="18px"
                                            >
                                                {route.icon}
                                            </Box>
                                            <Text
                                                me="auto"
                                                color={
                                                    activeRoute(
                                                        route.layout.toLowerCase() +
                                                            route.path.toLowerCase()
                                                    )
                                                        ? activeColor
                                                        : textColor
                                                }
                                                fontWeight={
                                                    activeRoute(
                                                        route.layout.toLowerCase() +
                                                            route.path.toLowerCase()
                                                    )
                                                        ? 'bold'
                                                        : 'normal'
                                                }
                                            >
                                                {route.name}
                                            </Text>
                                        </Flex>
                                        <Box
                                            h="36px"
                                            w="4px"
                                            bg={
                                                activeRoute(
                                                    route.layout.toLowerCase() +
                                                        route.path.toLowerCase()
                                                )
                                                    ? brandColor
                                                    : 'transparent'
                                            }
                                            borderRadius="5px"
                                        />
                                    </HStack>
                                </Box>
                            ) : (
                                <Box borderLeft="2px" borderColor="gray.300">
                                    <HStack
                                        spacing={
                                            activeRoute(
                                                route.layout.toLowerCase() +
                                                    route.path.toLowerCase()
                                            )
                                                ? '22px'
                                                : '26px'
                                        }
                                        py="5px"
                                        ps="10px"
                                    >
                                        <Flex w="100%" alignItems="center">
                                            <Text
                                                color={
                                                    activeRoute(
                                                        route.layout.toLowerCase() +
                                                            route.path.toLowerCase()
                                                    )
                                                        ? activeColor
                                                        : textColor
                                                }
                                                fontWeight={
                                                    activeRoute(
                                                        route.layout.toLowerCase() +
                                                            route.path.toLowerCase()
                                                    )
                                                        ? 'bold'
                                                        : 'normal'
                                                }
                                            >
                                                {route.name}
                                            </Text>
                                        </Flex>
                                        <Box
                                            h="36px"
                                            w="4px"
                                            bg={
                                                activeRoute(
                                                    route.layout.toLowerCase() +
                                                        route.path.toLowerCase()
                                                )
                                                    ? brandColor
                                                    : 'transparent'
                                            }
                                            borderRadius="5px"
                                        />
                                    </HStack>
                                </Box>
                            )}
                        </a>
                    </Link>
                    <Box pl="48px">
                        {route.items &&
                            Array.isArray(route.items) &&
                            createLinks(route.items)}
                    </Box>
                </Box>
            );
        });
    };
    //  BRAND
    return createLinks(routes);
}

export default SidebarLinks;
