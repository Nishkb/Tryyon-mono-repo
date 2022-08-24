import Layout from '../../ui/layouts/admin';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
    Flex,
    Text,
    useToast,
    useColorModeValue,
    Switch
} from '@chakra-ui/react';

import useDebounce from '../../utils/hooks/useDebounce';
import { HSeparator } from '../../ui/components/separator/Separator';
export default function TenantPage() {
    const toast = useToast();
    const [data, setData] = useState([]);
    const [currentTenant, setCurrentTenant] = useState();

    const [searchString, setSearchString] = useState('');

    const debouncedSearchString = useDebounce(searchString, 800);
    const router = useRouter();

    const textColor = useColorModeValue('secondaryGray.900', 'white');
    const bgColor = useColorModeValue('white', 'secondaryGray.900');

    useEffect(() => {
        fetch(`${router.basePath}/api/tenant?query=${debouncedSearchString}`, {
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
                    return { tenants: [] };
                }
                throw new Error(res_data.message);
            })
            .then((res) => {
                setData(res.tenants);
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
                heading="Tenants"
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
                        {data.map((tenant) => {
                            return (
                                <Flex
                                    cursor="pointer"
                                    onClick={() => setCurrentTenant(tenant)}
                                    direction="column"
                                    key={tenant.id}
                                    color={textColor}
                                    bgColor={bgColor}
                                    p="12px"
                                    rounded="xl"
                                >
                                    <Text fontSize="16px" fontWeight="600">
                                        {tenant.name}
                                    </Text>
                                    <Text fontSize="12px" color="gray.600">
                                        {tenant.company
                                            ? tenant.company.name
                                            : ''}
                                    </Text>
                                </Flex>
                            );
                        })}
                    </Flex>
                    {currentTenant && (
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
                                mb="12px"
                                fontWeight="700"
                                color={textColor}
                            >
                                {currentTenant.name}
                            </Text>
                            <Text fontSize="14px" mb="24px">
                                {currentTenant.description}
                            </Text>
                            <HSeparator />
                            <Text
                                fontSize="22px"
                                mt="20px"
                                mb="12px"
                                fontWeight="700"
                                color={textColor}
                            >
                                Company Details
                            </Text>
                            {currentTenant.company && (
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
                                        {currentTenant.company.name}
                                    </Text>
                                    <Text fontSize="14px">
                                        {currentTenant.company.description}
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
                                                    currentTenant.company
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
                                                    currentTenant.company
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
                                                    currentTenant.company
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
                                                    currentTenant.company
                                                        .adminApproval
                                                }
                                                readOnly
                                            />
                                        </Flex>
                                    </Flex>
                                </Flex>
                            )}
                        </Flex>
                    )}
                </Flex>
            </Layout>
        </>
    );
}