import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
    Box,
    Button,
    Flex,
    Input,
    Switch,
    Tab,
    Table,
    TableContainer,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    Tbody,
    Td,
    Text,
    Textarea,
    Th,
    Thead,
    Tr,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    useToast,
    FormControl,
    FormLabel,
    FormErrorMessage,
    Menu,
    MenuButton,
    MenuList,
    MenuItem
} from '@chakra-ui/react';

import useDebounce from '../../../utils/hooks/useDebounce';
import Head from 'next/head';
import Navbar from '../../../ui/components/Navbar';
import { Field, Formik } from 'formik';
import { ChevronDownIcon } from '@chakra-ui/icons';

export default function APIKeyPage() {
    const toast = useToast();
    const router = useRouter();
    const [searchString, setSearchString] = useState('');
    const [apiKeys, setApiKeys] = useState([]);
    const [tenantDetails, setTenantDetails] = useState({});
    const [tenants, setTenants] = useState([]);

    const [modalHeading, setModalHeading] = useState('');
    const [modalBody, setModalBody] = useState('');
    const [modalFooter, setModalFooter] = useState();
    const { isOpen, onOpen, onClose } = useDisclosure();

    const debouncedSearchString = useDebounce(searchString, 800);

    useEffect(() => {
        fetch(`/api/api-key?tenantId=${router.query.tenantId}`, {
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
                    router.push(`/auth/admin/login?next=/admin/tenants`);
                }

                if (res.status == 404) {
                    console.log(res_data.message);
                    toast({
                        title: res_data.message,
                        status: 'error',
                        duration: 2000,
                        isClosable: true
                    });
                    return { apiKeys: [] };
                }
                throw new Error(res_data.message);
            })
            .then((res) => {
                setApiKeys(res.apiKeys);
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

        fetch(`/api/tenant?id=${router.query.tenantId}`, {
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
                    router.push(`/auth/admin/login?next=/admin/tenants`);
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
                if (res.tenants.length !== 0) setTenantDetails(res.tenants[0]);
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

        fetch('/api/tenant/', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${sessionStorage.adminToken}`
            }
        })
            .then((res) => {
                if (res.ok) {
                    return res.json();
                }

                if (res.status == 401 || res.status == 403) {
                    router.push(`/auth/admin/login?next=/admin/tenants`);

                    throw new Error(
                        JSON.stringify({
                            message: 'Uauthorised Admin'
                        })
                    );
                } else {
                    const err = res.json();

                    throw new Error(
                        JSON.stringify({
                            message: err.message
                        })
                    );
                }
            })
            .then((res) => {
                setTenants(res.tenants);
            })
            .catch((err) => {
                console.error(err.message);
                toast({
                    title: err.message,
                    status: 'error',
                    isClosable: true
                });
            });
    }, [router, toast]);

    return (
        <>
            <Head>
                <title>API Keys</title>
                <meta
                    name="description"
                    content="Generated by create next app"
                />
                <link rel="icon" href="/blue_tshirt.svg" />
            </Head>
            <div>
                <Box>
                    <Box
                        minHeight="100vh"
                        height="100%"
                        overflow="auto"
                        position="relative"
                        maxHeight="100%"
                        w="100%"
                        transition="all 0.33s cubic-bezier(0.685, 0.0473, 0.346, 1)"
                        transitionDuration=".2s, .2s, .35s"
                        transitionProperty="top, bottom, width"
                        transitionTimingFunction="linear, linear, ease"
                    >
                        <Navbar
                            heading="API Keys"
                            searchString={searchString}
                            setSearchString={setSearchString}
                            placeholder="Search..."
                            size="full"
                        />
                        <Box
                            mx="auto"
                            px={{ base: '20px', md: '30px' }}
                            minH="100vh"
                            pt="100px"
                        >
                            <Tabs variant="soft-rounded" colorScheme="blue">
                                <TabList>
                                    <Tab>Tenant Details</Tab>
                                    <Tab>API Keys</Tab>
                                </TabList>
                                <TabPanels>
                                    <TabPanel>
                                        <Text
                                            fontSize="24px"
                                            mb="12px"
                                            fontWeight="700"
                                        >
                                            {tenantDetails.name}
                                        </Text>
                                        <Text fontSize="14px" mb="16px">
                                            {tenantDetails.description}
                                        </Text>
                                    </TabPanel>
                                    <TabPanel>
                                        <TableContainer>
                                            <Table>
                                                <Thead>
                                                    <Tr>
                                                        <Th>API Key</Th>
                                                        <Th>Status</Th>
                                                        <Th>Valid till</Th>
                                                        <Th>Actions</Th>
                                                    </Tr>
                                                </Thead>
                                                <Tbody>
                                                    {apiKeys.map(
                                                        (apiKey, index) => (
                                                            <Tr key={apiKey.id}>
                                                                <Td>
                                                                    {
                                                                        apiKey.APIKey
                                                                    }
                                                                </Td>
                                                                <Td>
                                                                    <Switch
                                                                        isChecked={
                                                                            apiKey.status
                                                                        }
                                                                        onChange={() => {
                                                                            fetch(
                                                                                `/api/api-key/update`,
                                                                                {
                                                                                    method: 'POST',
                                                                                    headers:
                                                                                        {
                                                                                            Authorization: `Bearer ${sessionStorage.adminToken}`,
                                                                                            'Content-Type':
                                                                                                'application/json'
                                                                                        },
                                                                                    body: JSON.stringify(
                                                                                        {
                                                                                            id: apiKey.id,
                                                                                            status: !apiKey.status
                                                                                        }
                                                                                    )
                                                                                }
                                                                            )
                                                                                .then(
                                                                                    async (
                                                                                        res
                                                                                    ) => {
                                                                                        const res_data =
                                                                                            await res.json();
                                                                                        if (
                                                                                            res.ok
                                                                                        ) {
                                                                                            return res_data;
                                                                                        }

                                                                                        if (
                                                                                            res.status ==
                                                                                                403 ||
                                                                                            res.status ==
                                                                                                401
                                                                                        ) {
                                                                                            router.push(
                                                                                                `/auth/admin/login?next=/admin/tenants`
                                                                                            );
                                                                                        }

                                                                                        throw new Error(
                                                                                            res_data.message
                                                                                        );
                                                                                    }
                                                                                )
                                                                                .then(
                                                                                    (
                                                                                        res
                                                                                    ) => {
                                                                                        setApiKeys(
                                                                                            (
                                                                                                prev
                                                                                            ) => {
                                                                                                const newArr =
                                                                                                    [
                                                                                                        ...prev
                                                                                                    ];
                                                                                                newArr[
                                                                                                    index
                                                                                                ].status =
                                                                                                    res.updatedAPIKey.status;

                                                                                                return newArr;
                                                                                            }
                                                                                        );
                                                                                    }
                                                                                )
                                                                                .catch(
                                                                                    (
                                                                                        err
                                                                                    ) => {
                                                                                        console.log(
                                                                                            err
                                                                                        );
                                                                                        toast(
                                                                                            {
                                                                                                title: err.message,
                                                                                                status: 'error',
                                                                                                duration: 2000,
                                                                                                isClosable: true
                                                                                            }
                                                                                        );
                                                                                    }
                                                                                );
                                                                        }}
                                                                    />
                                                                </Td>
                                                                <Td>
                                                                    {apiKey.validTill
                                                                        ? new Date(
                                                                              apiKey.validTill
                                                                          ).toLocaleString()
                                                                        : ''}
                                                                </Td>
                                                                <Td>
                                                                    <Flex gap="12px">
                                                                        <Button
                                                                            colorScheme="blue"
                                                                            onClick={() => {
                                                                                fetch(
                                                                                    `/api/api-key/refresh`,
                                                                                    {
                                                                                        method: 'POST',
                                                                                        headers:
                                                                                            {
                                                                                                Authorization: `Bearer ${sessionStorage.adminToken}`,
                                                                                                'Content-Type':
                                                                                                    'application/json'
                                                                                            },
                                                                                        body: JSON.stringify(
                                                                                            {
                                                                                                id: apiKey.id
                                                                                            }
                                                                                        )
                                                                                    }
                                                                                )
                                                                                    .then(
                                                                                        async (
                                                                                            res
                                                                                        ) => {
                                                                                            const res_data =
                                                                                                await res.json();
                                                                                            if (
                                                                                                res.ok
                                                                                            ) {
                                                                                                return res_data;
                                                                                            }

                                                                                            if (
                                                                                                res.status ==
                                                                                                    403 ||
                                                                                                res.status ==
                                                                                                    401
                                                                                            ) {
                                                                                                router.push(
                                                                                                    `/auth/admin/login?next=/admin/tenants`
                                                                                                );
                                                                                            }

                                                                                            throw new Error(
                                                                                                res_data.message
                                                                                            );
                                                                                        }
                                                                                    )
                                                                                    .then(
                                                                                        (
                                                                                            res
                                                                                        ) => {
                                                                                            setApiKeys(
                                                                                                (
                                                                                                    prev
                                                                                                ) => {
                                                                                                    const newArr =
                                                                                                        [
                                                                                                            ...prev
                                                                                                        ];
                                                                                                    newArr[
                                                                                                        index
                                                                                                    ].APIKey =
                                                                                                        res.refreshedAPIKey.APIKey;

                                                                                                    return newArr;
                                                                                                }
                                                                                            );
                                                                                        }
                                                                                    )
                                                                                    .catch(
                                                                                        (
                                                                                            err
                                                                                        ) => {
                                                                                            console.log(
                                                                                                err
                                                                                            );
                                                                                            toast(
                                                                                                {
                                                                                                    title: err.message,
                                                                                                    status: 'error',
                                                                                                    duration: 2000,
                                                                                                    isClosable: true
                                                                                                }
                                                                                            );
                                                                                        }
                                                                                    );
                                                                            }}
                                                                        >
                                                                            Refresh
                                                                        </Button>
                                                                        <Button
                                                                            colorScheme="red"
                                                                            onClick={() => {
                                                                                fetch(
                                                                                    `/api/api-key/delete`,
                                                                                    {
                                                                                        method: 'DELETE',
                                                                                        headers:
                                                                                            {
                                                                                                Authorization: `Bearer ${sessionStorage.adminToken}`,
                                                                                                'Content-Type':
                                                                                                    'application/json'
                                                                                            },
                                                                                        body: JSON.stringify(
                                                                                            {
                                                                                                id: apiKey.id
                                                                                            }
                                                                                        )
                                                                                    }
                                                                                )
                                                                                    .then(
                                                                                        async (
                                                                                            res
                                                                                        ) => {
                                                                                            const res_data =
                                                                                                await res.json();
                                                                                            if (
                                                                                                res.ok
                                                                                            ) {
                                                                                                return res_data;
                                                                                            }

                                                                                            if (
                                                                                                res.status ==
                                                                                                    403 ||
                                                                                                res.status ==
                                                                                                    401
                                                                                            ) {
                                                                                                router.push(
                                                                                                    `/auth/admin/login?next=/admin/tenants`
                                                                                                );
                                                                                            }

                                                                                            throw new Error(
                                                                                                res_data.message
                                                                                            );
                                                                                        }
                                                                                    )
                                                                                    .then(
                                                                                        (
                                                                                            res
                                                                                        ) => {
                                                                                            setApiKeys(
                                                                                                (
                                                                                                    prev
                                                                                                ) => {
                                                                                                    const newArr =
                                                                                                        [
                                                                                                            ...prev
                                                                                                        ];
                                                                                                    newArr.splice(
                                                                                                        index,
                                                                                                        1
                                                                                                    );

                                                                                                    return newArr;
                                                                                                }
                                                                                            );

                                                                                            toast(
                                                                                                {
                                                                                                    title: res.message,
                                                                                                    status: 'success',
                                                                                                    isClosable: true
                                                                                                }
                                                                                            );
                                                                                        }
                                                                                    )
                                                                                    .catch(
                                                                                        (
                                                                                            err
                                                                                        ) => {
                                                                                            console.log(
                                                                                                err
                                                                                            );
                                                                                            toast(
                                                                                                {
                                                                                                    title: err.message,
                                                                                                    status: 'error',
                                                                                                    duration: 2000,
                                                                                                    isClosable: true
                                                                                                }
                                                                                            );
                                                                                        }
                                                                                    );
                                                                            }}
                                                                        >
                                                                            Delete
                                                                        </Button>
                                                                    </Flex>
                                                                </Td>
                                                            </Tr>
                                                        )
                                                    )}
                                                    <Tr>
                                                        <Td colSpan={4}>
                                                            <Button
                                                                w="100%"
                                                                bgColor="transparent"
                                                                onClick={onOpen}
                                                            >
                                                                Add API Key
                                                            </Button>
                                                        </Td>
                                                    </Tr>
                                                </Tbody>
                                            </Table>
                                        </TableContainer>
                                    </TabPanel>
                                </TabPanels>
                            </Tabs>
                        </Box>
                    </Box>
                </Box>
                {isOpen && (
                    <Modal isOpen={isOpen} onClose={onClose}>
                        <ModalOverlay />
                        <ModalContent>
                            <ModalHeader>Add API Key</ModalHeader>
                            <ModalCloseButton />
                            <ModalBody>
                                <Formik
                                    initialValues={{
                                        status: true,
                                        validTill: ''
                                    }}
                                    onSubmit={(values) => {
                                        const body = { ...values };
                                        if (body.validTill == '')
                                            delete body.validTill;
                                        else {
                                            const { validTill } = body;
                                            body.validTill = new Date(
                                                validTill
                                            ).toISOString();
                                        }

                                        body.tenantId = tenantDetails.id;

                                        fetch('/api/api-key/create', {
                                            method: 'POST',
                                            headers: {
                                                Authorization: `Bearer ${sessionStorage.adminToken}`,
                                                'Content-Type':
                                                    'application/json'
                                            },
                                            body: JSON.stringify(body)
                                        })
                                            .then(async (res) => {
                                                const res_data =
                                                    await res.json();
                                                if (res.ok) {
                                                    return res_data;
                                                }

                                                if (
                                                    res.status == 403 ||
                                                    res.status == 401
                                                ) {
                                                    router.push(
                                                        `/auth/admin/login?next=/admin/tenants`
                                                    );
                                                }

                                                throw new Error(
                                                    res_data.message
                                                );
                                            })
                                            .then((res) => {
                                                setApiKeys((prev) => [
                                                    ...prev,
                                                    res.createdAPIKey
                                                ]);
                                                toast({
                                                    title: res.message,
                                                    status: 'success',
                                                    isClosable: true
                                                });

                                                onClose();
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
                                    }}
                                >
                                    {({
                                        handleSubmit,
                                        errors,
                                        touched,
                                        values,
                                        setValues
                                    }) => (
                                        <form>
                                            <FormControl mb="4px">
                                                <FormLabel
                                                    mt="12px"
                                                    fontSize="sm"
                                                    fontWeight="500"
                                                    display="flex"
                                                    alignItems="baseline"
                                                    gap="4px"
                                                >
                                                    Valid Till
                                                    <Text
                                                        fontSize="12px"
                                                        color="gray.400"
                                                    >
                                                        (optional)
                                                    </Text>
                                                </FormLabel>
                                                <Field
                                                    as={Input}
                                                    type="datetime-local"
                                                    isRequired={true}
                                                    id="validTill"
                                                    name="validTill"
                                                    variant="auth"
                                                    fontSize="sm"
                                                    mb="3px"
                                                    fontWeight="500"
                                                    size="md"
                                                />
                                            </FormControl>
                                            <FormControl
                                                mt="24px"
                                                display="flex"
                                                alignItems="center"
                                                justifyContent="space-between"
                                            >
                                                <FormLabel
                                                    htmlFor="status"
                                                    name="status"
                                                >
                                                    Status
                                                </FormLabel>
                                                <Field
                                                    as={Switch}
                                                    isChecked={values.status}
                                                    onChange={() =>
                                                        setValues((prev) => ({
                                                            ...prev,
                                                            status: !prev.status
                                                        }))
                                                    }
                                                    variant="auth"
                                                    fontSize="sm"
                                                    mb="3px"
                                                    fontWeight="500"
                                                    size="md"
                                                />
                                            </FormControl>
                                            <ModalFooter>
                                                <Button
                                                    variant="ghost"
                                                    mr={3}
                                                    onClick={onClose}
                                                >
                                                    Cancel
                                                </Button>
                                                <Button
                                                    onClick={handleSubmit}
                                                    colorScheme="blue"
                                                >
                                                    Add
                                                </Button>
                                            </ModalFooter>
                                        </form>
                                    )}
                                </Formik>
                            </ModalBody>
                        </ModalContent>
                    </Modal>
                )}
            </div>
        </>
    );
}
