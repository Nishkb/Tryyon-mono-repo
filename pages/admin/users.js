import Layout from '../../ui/layouts/admin';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
    Flex,
    Text,
    useToast,
    useColorModeValue,
    Switch,
    Grid,
    GridItem,
    Button
} from '@chakra-ui/react';

import useDebounce from '../../utils/hooks/useDebounce';
import { HSeparator } from '../../ui/components/separator/Separator';

export default function UserPage() {
    const toast = useToast();
    const [data, setData] = useState([]);
    const [currentUser, setCurrentUser] = useState();

    const [searchString, setSearchString] = useState('');

    const debouncedSearchString = useDebounce(searchString, 800);
    const router = useRouter();

    const textColor = useColorModeValue('secondaryGray.900', 'white');
    const bgColor = useColorModeValue('white', 'secondaryGray.900');

    useEffect(() => {
        fetch(`${router.basePath}/api/user?query=${debouncedSearchString}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${sessionStorage.adminToken}`
            }
        })
            .then(async (res) => {
                const res_data = await res.json();
                if (res.ok) {
                    return res_data;
                }

                if (res.status == 403 || res.status == 401) {
                    router.push(`/auth/admin/login?next=${router.pathname}`);
                }

                if (res.status == 404) {
                    console.log(res_data.message);
                    toast({
                        title: res_data.message,
                        status: 'error',
                        duration: 2000,
                        isClosable: true
                    });
                    return { users: [] };
                }
                throw new Error(res_data.message);
            })
            .then((res) => {
                setData(res.users);
                console.log(res.users);
            })
            .catch((err) => {
                console.log(err);
                toast({
                    title: err.message,
                    status: 'error',
                    duration: 2000,
                    isClosable: true
                });
            });
    }, [router, debouncedSearchString, toast]);

    return (
        <>
            <Layout
                heading="Users"
                searchString={searchString}
                setSearchString={setSearchString}
                placeholder="Search..."
            >
                <Flex
                    gap="16px"
                    direction={{ sm: 'column', md: 'row' }}
                    mb="16px"
                >
                    <Flex
                        direction="column"
                        w={{ sm: '100%', md: '300px' }}
                        gap="8px"
                        maxH={{ sm: '30vh', md: '80vh' }}
                        overflow="scroll"
                    >
                        {data.map((user) => {
                            return (
                                <Flex
                                    cursor="pointer"
                                    onClick={() => setCurrentUser(user)}
                                    direction="column"
                                    key={user.id}
                                    color={textColor}
                                    bgColor={bgColor}
                                    p="12px"
                                    rounded="xl"
                                >
                                    <Text fontSize="16px" fontWeight="600">
                                        {`${user.firstname} ${user.lastname}`}
                                    </Text>
                                    <Text fontSize="12px" color="gray.600">
                                        @{user.username}
                                    </Text>
                                </Flex>
                            );
                        })}
                    </Flex>
                    {currentUser && (
                        <Flex
                            direction="column"
                            bgColor={bgColor}
                            w="100%"
                            rounded="xl"
                            h="max-content"
                            p="16px"
                        >
                            <Text
                                fontSize="24px"
                                mb="4px"
                                fontWeight="700"
                                color={textColor}
                            >
                                {`${currentUser.firstname} ${currentUser.lastname}`}
                            </Text>
                            <Text fontSize="12px" mb="24px">
                                @{currentUser.username}
                            </Text>
                            <Grid
                                templateColumns="1fr 2fr"
                                mb="24px"
                                gap="16px"
                                maxW="500px"
                            >
                                <GridItem>
                                    <Text fontSize="14px">Phone</Text>
                                </GridItem>
                                <GridItem>
                                    <Text fontSize="14px">
                                        {currentUser.phone}
                                    </Text>
                                </GridItem>
                                <GridItem>
                                    <Text fontSize="14px">Email</Text>
                                </GridItem>
                                <GridItem>
                                    <Text fontSize="14px">
                                        {currentUser.email}
                                    </Text>
                                </GridItem>
                                <GridItem>
                                    <Text fontSize="14px">Email verified?</Text>
                                </GridItem>
                                <GridItem>
                                    <Switch
                                        readOnly
                                        checked={currentUser.email_verified}
                                    />
                                </GridItem>
                                <GridItem>
                                    <Text fontSize="14px">Password</Text>
                                </GridItem>
                                <GridItem>
                                    <Button
                                        size="xs"
                                        colorScheme="blue"
                                        onClick={() => {
                                            console.log(currentUser.email);

                                            fetch(
                                                '/api/user/password-change-request',
                                                {
                                                    method: 'POST',
                                                    headers: {
                                                        Authorization: `Bearer ${sessionStorage.adminToken}`,
                                                        'Content-Type':
                                                            'application/json'
                                                    },
                                                    body: JSON.stringify({
                                                        email: currentUser.email
                                                    })
                                                }
                                            )
                                                .then(async (res) => {
                                                    if (res.ok) {
                                                        return await res.json();
                                                    }
                                                    if (
                                                        res.status == '401' ||
                                                        res.status == '403'
                                                    ) {
                                                        toast({
                                                            title: 'Unauthorized access',
                                                            isClosable: true,
                                                            status: 'error'
                                                        });

                                                        router.push(
                                                            '/auth/admin/login?next=/admin/users'
                                                        );
                                                    }

                                                    const err =
                                                        await res.json();
                                                    throw new Error(
                                                        err.message
                                                    );
                                                })
                                                .then((res) => {
                                                    console.log(res);
                                                    toast({
                                                        title: res.message,
                                                        status: 'success',
                                                        isClosable: true
                                                    });
                                                })
                                                .catch((err) => {
                                                    toast({
                                                        title: err.message,
                                                        status: 'error',
                                                        isClosable: true
                                                    });
                                                    console.error(err.message);
                                                });
                                        }}
                                    >
                                        Change
                                    </Button>
                                </GridItem>
                            </Grid>

                            <HSeparator />
                            {currentUser.company && (
                                <>
                                    <Text
                                        fontSize="22px"
                                        mt="20px"
                                        mb="12px"
                                        fontWeight="700"
                                        color={textColor}
                                    >
                                        Company Details
                                    </Text>
                                    <Flex
                                        direction="column"
                                        rounded="xl"
                                        border="1px"
                                        borderColor="gray.200"
                                        p="24px"
                                        maxW="550px"
                                    >
                                        <Text
                                            fontSize="18px"
                                            mb="12px"
                                            fontWeight="700"
                                            color={textColor}
                                        >
                                            {currentUser.company.name}
                                        </Text>
                                        <Text fontSize="14px">
                                            {currentUser.company.description}
                                        </Text>
                                        <Flex
                                            direction="column"
                                            fontSize="14px"
                                            mt="16px"
                                            gap="8px"
                                        >
                                            <Flex
                                                alignItems="center"
                                                justifyContent="space-between"
                                                gap="16px"
                                            >
                                                <Text>GST Number</Text>
                                                <Text>
                                                    {
                                                        currentUser.company
                                                            .gstNumber
                                                    }
                                                </Text>
                                            </Flex>
                                            <Flex
                                                alignItems="center"
                                                justifyContent="space-between"
                                                gap="16px"
                                            >
                                                <Text>PAN Number</Text>
                                                <Text>
                                                    {
                                                        currentUser.company
                                                            .panNumber
                                                    }
                                                </Text>
                                            </Flex>
                                            <Flex
                                                alignItems="center"
                                                justifyContent="space-between"
                                                gap="16px"
                                            >
                                                <Text>Aadhar Number</Text>
                                                <Text>
                                                    {
                                                        currentUser.company
                                                            .aadharNumber
                                                    }
                                                </Text>
                                            </Flex>
                                            <Flex
                                                alignItems="center"
                                                justifyContent="space-between"
                                                gap="16px"
                                            >
                                                <Text>Admin approval</Text>
                                                <Switch
                                                    checked={
                                                        currentUser.company
                                                            .adminApproval
                                                    }
                                                    readOnly
                                                />
                                            </Flex>
                                        </Flex>
                                    </Flex>
                                </>
                            )}

                            {currentUser.company && currentUser.company.tenant && (
                                <>
                                    <Text
                                        fontSize="22px"
                                        mt="20px"
                                        mb="12px"
                                        fontWeight="700"
                                        color={textColor}
                                    >
                                        Tenant Details
                                    </Text>
                                    <Flex
                                        direction="column"
                                        rounded="xl"
                                        border="1px"
                                        borderColor="gray.200"
                                        p="24px"
                                        maxW="550px"
                                    >
                                        <Text
                                            fontSize="18px"
                                            mb="12px"
                                            fontWeight="700"
                                            color={textColor}
                                        >
                                            {currentUser.company.tenant.name}
                                        </Text>
                                        <Text fontSize="14px">
                                            {
                                                currentUser.company.tenant
                                                    .description
                                            }
                                        </Text>
                                    </Flex>
                                </>
                            )}
                        </Flex>
                    )}
                </Flex>
            </Layout>
        </>
    );
}
