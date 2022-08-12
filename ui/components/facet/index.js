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
    Box
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
        token
    } = props;

    const [availableCategories, setAvailableCategories] = useState([]);
    const [attributeFields, setAttributeFields] = useState([0]);
    const [attributeList, setAttributeList] = useState({ 0: ['', ''] });
    const [availableAttributes, setAvailableAttributes] = useState([]);

    const addCategory = (category, index) => {
        setAvailableCategories((prev) => {
            return prev.filter((val) => {
                return val.id !== category.id;
            });
        });

        setCategory(category);
    };

    const removeCategory = (category) => {
        setAvailableCategories((prev) => [...prev, category]);

        setCategory('');
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
                    <Text fontSize="14px" fontWeight={500}>
                        Categories
                    </Text>
                    <Flex>
                        {category != '' && (
                            <Tag m="8px" bgColor="blue.500" color="white">
                                <TagLabel>{category.name}</TagLabel>
                                <TagCloseButton
                                    onClick={() => removeCategory(category)}
                                />
                            </Tag>
                        )}
                    </Flex>
                    <Menu isLazy mb="8px">
                        <MenuButton
                            as={Button}
                            colorScheme="blue"
                            my="16px"
                            fontSize="14px"
                            py="4px"
                            rightIcon={<ChevronDownIcon />}
                        >
                            Select categories
                        </MenuButton>
                        <MenuList maxH="150px" overflowY="scroll">
                            {availableCategories.map((category, index) => (
                                <MenuItem
                                    onClick={() => addCategory(category, index)}
                                    key={index}
                                >
                                    {category.name}
                                </MenuItem>
                            ))}
                        </MenuList>
                    </Menu>
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
