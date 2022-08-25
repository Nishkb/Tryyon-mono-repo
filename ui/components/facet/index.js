import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import {
    Button,
    Flex,
    Input,
    Text,
    useToast,
    Select,
    Tag,
    TagCloseButton,
    TagLabel,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    VStack,
    Code,
    Box,
    MenuOptionGroup,
    MenuItemOption,
    MenuDivider
} from '@chakra-ui/react';

import Card from '../card/Card';

import { ChevronDownIcon } from '@chakra-ui/icons';
import { HSeparator, VSeparator } from '../separator/Separator';

export default function Facet(props) {
    const router = useRouter();
    const toast = useToast();

    const {
        category,
        setCategory,
        attributes,
        setAttributes,
        priceFrom,
        setPriceFrom,
        priceTo,
        setPriceTo,
        token,
        showTenantSelect,
        tenants,
        setTenants
    } = props;

    const [availableCategories, setAvailableCategories] = useState([]);
    const [attributeFields, setAttributeFields] = useState([0]);
    const [attributeList, setAttributeList] = useState({ 0: ['', ''] });
    const [availableAttributes, setAvailableAttributes] = useState([]);
    const [availableTenants, setAvailableTenants] = useState([]);

    const addCategory = (category, index) => {
        setAvailableCategories((prev) => {
            return prev.filter((val) => {
                return val.id !== category.id;
            });
        });

        setCategory(category);
    };

    useEffect(() => {
        fetch(`${router.basePath}/api/products/category`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(async (res) => {
                const res_data = await res.json();
                if (res.ok) {
                    console.log(res_data);
                    return res_data;
                }

                if (res.status == 403 || res.status == 401) {
                    // alert('Admin not logged in...');
                    router.push(`/auth/login?next=${router.pathname}`);
                }

                if (res.status == 400) {
                    toast({
                        title: res_data.message,
                        status: 'error',
                        duration: 2000,
                        isClosable: true
                    });
                    router.push(`/error?message=${res_data.message}`);
                }

                if (res.status == 404) {
                    console.log(res_data.message);
                    toast({
                        title: res_data.message,
                        status: 'error',
                        duration: 2000,
                        isClosable: true
                    });
                    return { categories: [] };
                }
                throw new Error(res_data.message);
            })
            .then((res) => {
                setAvailableCategories(res.categories);
                // console.log(data);
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

        fetch(`${router.basePath}/api/products/attribute`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(async (res) => {
                const res_data = await res.json();
                if (res.ok) {
                    console.log(res_data);
                    return res_data;
                }

                if (res.status == 403 || res.status == 401) {
                    // alert('Admin not logged in...');
                    router.push(`/auth/login?next=${router.pathname}`);
                }

                if (res.status == 400) {
                    toast({
                        title: res_data.message,
                        status: 'error',
                        duration: 2000,
                        isClosable: true
                    });
                    router.push(`/error?message=${res_data.message}`);
                }

                if (res.status == 404) {
                    console.log(res_data.message);
                    toast({
                        title: res_data.message,
                        status: 'error',
                        duration: 2000,
                        isClosable: true
                    });
                    return { attributes: [] };
                }
                throw new Error(res_data.message);
            })
            .then((res) => {
                setAvailableAttributes(res.attributes);
                // console.log(data);
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

        fetch(`${router.basePath}/api/tenant`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
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
                setAvailableTenants(res.tenants);
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
    }, [router, toast, token]);

    useEffect(() => {
        let attr = {};
        Object.keys(attributeList).forEach((element) => {
            if (
                attributeList[element][0] != '' &&
                attributeList[element][1] != ''
            )
                attr[attributeList[element][0]] = attributeList[element][1];
        });
        setAttributes(attr);
    }, [attributeList, setAttributes]);

    return (
        <Card mb="16px">
            <Text fontSize="18px" fontWeight={700}>
                Filters
            </Text>
            <HSeparator my="16px" />

            <Flex>
                <Flex direction="column">
                    <Flex direction="column">
                        <Text fontSize="14px" fontWeight={500}>
                            Category
                        </Text>
                        <Menu isLazy mb="8px">
                            <MenuButton
                                as={Button}
                                w="150px"
                                textAlign="left"
                                colorScheme="blue"
                                mt="4px"
                                mb="8px"
                                fontSize="14px"
                                py="4px"
                                pr="8px"
                                rightIcon={<ChevronDownIcon />}
                            >
                                {!category || category.name == ''
                                    ? 'Select category'
                                    : category.name}
                            </MenuButton>
                            <MenuList maxH="150px" overflowY="scroll">
                                <MenuItem onClick={() => setCategory('')}>
                                    None
                                </MenuItem>
                                <MenuDivider />
                                {availableCategories.map((category, index) => (
                                    <MenuItem
                                        onClick={() =>
                                            addCategory(category, index)
                                        }
                                        key={index}
                                    >
                                        {category.name}
                                    </MenuItem>
                                ))}
                            </MenuList>
                        </Menu>
                    </Flex>
                    {showTenantSelect && (
                        <Flex direction="column">
                            <Text fontSize="14px" fontWeight={500}>
                                Tenants
                            </Text>
                            <Flex gap="8px" maxW="200px" wrap="wrap">
                                {availableTenants
                                    .filter((t) => tenants.indexOf(t.id) !== -1)
                                    .map((t) => (
                                        <Tag colorScheme="blue" key={t.id}>
                                            <TagLabel>{t.name}</TagLabel>
                                        </Tag>
                                    ))}
                            </Flex>
                            <Menu isLazy mb="8px" closeOnSelect={false}>
                                <MenuButton
                                    as={Button}
                                    w="150px"
                                    textAlign="left"
                                    colorScheme="blue"
                                    mt="4px"
                                    fontSize="14px"
                                    py="4px"
                                    pr="8px"
                                    rightIcon={<ChevronDownIcon />}
                                >
                                    Select tenants
                                </MenuButton>
                                <MenuList maxH="150px" overflowY="scroll">
                                    <MenuOptionGroup
                                        type="checkbox"
                                        onChange={(e) => setTenants(e)}
                                        value={tenants}
                                    >
                                        {availableTenants.map(
                                            (tenant, index) => (
                                                <MenuItemOption
                                                    value={tenant.id}
                                                    key={index}
                                                >
                                                    {tenant.name}
                                                </MenuItemOption>
                                            )
                                        )}
                                    </MenuOptionGroup>
                                </MenuList>
                            </Menu>
                        </Flex>
                    )}
                </Flex>

                <VSeparator mx="24px" />
                <Flex>
                    <Box>
                        <Text fontSize="14px" fontWeight={500}>
                            Attributes
                        </Text>
                        <VStack spacing="8px">
                            {attributeFields.map((af) => {
                                return (
                                    <Flex my="8px" key={af}>
                                        <Select
                                            maxW="200px"
                                            mr="8px"
                                            onChange={(e) => {
                                                setAttributeList((prev) => ({
                                                    ...prev,
                                                    [af]: [
                                                        e.target.options[
                                                            e.target
                                                                .selectedIndex
                                                        ].value,
                                                        ''
                                                    ]
                                                }));
                                            }}
                                            placeholder="Select attribute"
                                        >
                                            {availableAttributes.map(
                                                (att, index) => (
                                                    <option
                                                        value={att.name}
                                                        key={index}
                                                    >
                                                        {att.name}
                                                    </option>
                                                )
                                            )}
                                        </Select>
                                        <Input
                                            maxW="200px"
                                            value={
                                                attributeList[af]
                                                    ? attributeList[af][1]
                                                    : ''
                                            }
                                            onChange={(e) =>
                                                setAttributeList((prev) => ({
                                                    ...prev,
                                                    [af]: [
                                                        prev[af][0],
                                                        e.target.value
                                                    ]
                                                }))
                                            }
                                        />
                                    </Flex>
                                );
                            })}
                        </VStack>
                        <Button
                            my="16px"
                            onClick={() =>
                                setAttributeFields((prev) => [
                                    ...prev,
                                    prev[prev.length - 1] + 1
                                ])
                            }
                            colorScheme="blue"
                            fontSize="14px"
                        >
                            Add
                        </Button>
                    </Box>
                    <Box pl="16px">
                        <Text fontSize="14px" fontWeight={500}>
                            Preview
                        </Text>
                        <Code
                            p="16px"
                            borderRadius="2xl"
                            colorScheme="blue"
                            variant="solid"
                        >
                            <pre>{JSON.stringify(attributes, null, 2)}</pre>
                        </Code>
                    </Box>
                </Flex>
                <VSeparator mx="24px" />
                <Flex direction="column">
                    <Text fontSize="14px" fontWeight={500}>
                        Price from
                    </Text>
                    <Input
                        mb="8px"
                        maxW="200px"
                        value={priceFrom}
                        type="number"
                        onChange={(e) =>
                            setPriceFrom(parseInt(e.target.value, 10))
                        }
                    />
                    <Text fontSize="14px" fontWeight={500}>
                        Price to
                    </Text>
                    <Input
                        mb="8px"
                        maxW="200px"
                        value={priceTo}
                        type="number"
                        onChange={(e) =>
                            setPriceTo(parseInt(e.target.value, 10))
                        }
                    />
                </Flex>
            </Flex>
        </Card>
    );
}
