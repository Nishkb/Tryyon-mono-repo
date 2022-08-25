import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    Button,
    Flex,
    useColorModeValue,
    Text,
    useColorMode,
    IconButton,
    Menu,
    MenuButton,
    MenuItem,
    MenuItemOption,
    MenuList,
    MenuGroup,
    MenuDivider
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { MdDarkMode, MdLightMode, MdLogin, MdLogout } from 'react-icons/md';
import { PersonIcon } from '../icons/Icons';
import { SearchBar } from '../searchbar';

export function checkLoggedIn() {
    if (typeof window !== 'undefined') {
        return !!(sessionStorage.userToken || sessionStorage.adminToken);
    }

    return false;
}

export default function Navbar({
    heading,
    background,
    searchString,
    setSearchString,
    placeholder,
    size
}) {
    const router = useRouter();
    const textColor = useColorModeValue('secondaryGray.900', 'white');
    const bgColor = useColorModeValue('white', 'secondaryGray.900');
    const searchBGColor = useColorModeValue('secondaryGray.300', 'navy.900');
    const { colorMode, toggleColorMode } = useColorMode();
    const [isLoggedIn, setLoggedIn] = useState(false);
    const [breadCrumbs, setBreadCrumbs] = useState([]);

    useEffect(() => {
        setLoggedIn(checkLoggedIn());
        setBreadCrumbs([router.pathname.split('/')]);
        setBreadCrumbs(() => {
            const newArr = [];

            router.pathname.split('/').forEach((e) => {
                if (newArr.length == 0) {
                    newArr.push(['HOME', '/']);
                } else {
                    if (e != '' && e[0] != '[')
                        newArr.push([
                            e.toUpperCase(),
                            newArr[newArr.length - 1][1] + e + '/'
                        ]);
                }
            });

            return newArr;
        });
    }, [router]);

    return (
        <Flex mx="auto" position="relative">
            <Flex
                p="12px 24px"
                justifyContent="space-between"
                alignItems="center"
                position="fixed"
                bgColor="transparent"
                w="100%"
                maxW={{
                    sm: '100%',
                    md: size == 'full' ? '100%' : 'calc(100vw - 300px)'
                }}
                backdropFilter="blur(2px)"
                borderRadius="3xl"
                mt="12px"
                h="80px"
                zIndex="10"
            >
                <Flex direction="column" display={{ sm: 'none', md: 'flex' }}>
                    <Breadcrumb
                        fontSize="12px"
                        fontWeight="500"
                        letterSpacing="3px"
                        color="gray.500"
                        separator={'|'}
                    >
                        {breadCrumbs.map((b, idx) => (
                            <BreadcrumbItem key={idx}>
                                <BreadcrumbLink
                                    href={b[1] === router.pathname ? '#' : b[1]}
                                >
                                    {b[0]}
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                        ))}
                    </Breadcrumb>
                    <Text
                        color={textColor}
                        lineHeight="40px"
                        fontSize="32px"
                        fontWeight="700"
                    >
                        {heading ? heading : 'Tryyon'}
                    </Text>
                </Flex>

                <Flex
                    gap="16px"
                    alignItems="center"
                    bgColor={bgColor}
                    p="9px"
                    borderRadius="full"
                    boxShadow={
                        colorMode == 'light'
                            ? 'rgba(112, 144, 176, 0.18) 14px 17px 40px 4px'
                            : 'none'
                    }
                >
                    <SearchBar
                        background={background ? background : searchBGColor}
                        value={searchString}
                        setValue={setSearchString}
                        placeholder={placeholder}
                    />
                    <IconButton
                        onClick={toggleColorMode}
                        icon={
                            colorMode == 'light' ? (
                                <MdDarkMode />
                            ) : (
                                <MdLightMode />
                            )
                        }
                        rounded="full"
                    />
                    <Menu>
                        <MenuButton
                            as={IconButton}
                            icon={<PersonIcon />}
                            rounded="full"
                            colorScheme="blue"
                        />
                        <MenuList>
                            {isLoggedIn ? (
                                <MenuGroup title="Hey there!">
                                    <MenuDivider />
                                    <MenuItem
                                        onClick={() => {
                                            sessionStorage.clear();
                                            router.push('/');
                                        }}
                                    >
                                        Logout
                                    </MenuItem>
                                </MenuGroup>
                            ) : (
                                <MenuGroup title="Welcome to Tryyon!">
                                    <MenuDivider />
                                    <MenuItem
                                        onClick={() => {
                                            router.push('/auth/login');
                                        }}
                                    >
                                        Login as user
                                    </MenuItem>
                                    <MenuItem
                                        onClick={() => {
                                            router.push('/auth/admin/login');
                                        }}
                                    >
                                        Login as admin
                                    </MenuItem>
                                </MenuGroup>
                            )}
                        </MenuList>
                    </Menu>
                </Flex>
            </Flex>
        </Flex>
    );
}
