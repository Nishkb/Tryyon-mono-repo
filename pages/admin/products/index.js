import Layout from '../../../ui/layouts/admin';
import TableComp from '../../../ui/components/table';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import {
    Button,
    Flex,
    Input,
    Text,
    Textarea,
    useColorModeValue,
    useDisclosure,
    useToast,
    Checkbox,
    FormLabel,
    Select,
    HStack,
    Tag,
    TagCloseButton,
    TagLabel,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    VStack,
    Code,
    Box,
    IconButton
} from '@chakra-ui/react';

import { AddIcon, ChevronDownIcon } from '@chakra-ui/icons';

import { SearchBar } from '../../../ui/components/searchbar';
import useDebounce from '../../../utils/hooks/useDebounce';
import Facet from '../../../ui/components/facet';

const columnsData = [
    {
        Header: 'ID',
        accessor: 'id'
    },
    {
        Header: 'NAME',
        accessor: 'name'
    },
    {
        Header: 'DESCRIPTION',
        accessor: 'description'
    },
    {
        Header: 'SHORT DESCRIPTIONS',
        accessor: 'shortDescriptions'
    },
    {
        Header: 'SLUG',
        accessor: 'slug'
    },
    {
        Header: 'Quantity',
        accessor: 'quantity'
    },
    {
        Header: 'PUBLISHED',
        accessor: 'published'
    },
    {
        Header: 'SUPPLIER ID',
        accessor: 'supplierId'
    },
    {
        Header: 'CATEGORIES',
        accessor: 'categories'
    },
    {
        Header: 'MANUFACTURER',
        accessor: 'manufacturer'
    },
    {
        Header: 'LOCATIONS',
        accessor: 'locations'
    },
    {
        Header: 'COUNTRY OF ORIGIN',
        accessor: 'countryOfOrigin'
    },
    {
        Header: 'TRENDING',
        accessor: 'trending'
    },
    {
        Header: 'FEATURED FROM',
        accessor: 'featuredFrom'
    },
    {
        Header: 'FEATURED TO',
        accessor: 'featuredTo'
    },
    {
        Header: 'GUEST CHECKOUT',
        accessor: 'guestCheckout'
    },
    {
        Header: 'PRIVATE',
        accessor: 'private_product'
    },
    {
        Header: 'MARKET PLACE',
        accessor: 'marketPlace'
    }
];

export default function ProductPage() {
    const toast = useToast();
    const [data, setData] = useState([]);
    const [page, setPage] = useState(0);
    const [searchString, setSearchString] = useState('');
    const [categoryQuery, setCategoryQuery] = useState('');
    const [attributesQuery, setAttributesQuery] = useState({});

    const [modalHeading, setModalHeading] = useState('');
    const [modalBody, setModalBody] = useState('');
    const [modalFooter, setModalFooter] = useState();

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [slug, setSlug] = useState('');
    const [quantity, setQuantity] = useState(0);
    const [supplier, setSupplier] = useState('');
    const [published, setPublished] = useState(false);
    const [categories, setCategories] = useState([]);
    const [availableCategories, setAvailableCategories] = useState([]);
    const [shortDescription, setShortDescription] = useState('');
    const [id, setID] = useState('');

    const [attributeFields, setAttributeFields] = useState([0]);
    const [attributeList, setAttributeList] = useState({ 0: ['', ''] });
    const [attributes, setAttributes] = useState({});
    const [availableAttributes, setAvailableAttributes] = useState([]);
    const [priceFrom, setPriceFrom] = useState(0);
    const [priceTo, setPriceTo] = useState(0);
    const [tenants, setTenants] = useState([]);

    const debouncedSearchString = useDebounce(searchString, 1500);
    const debouncedCategoryQuery = useDebounce(categoryQuery, 1500);
    const debouncedAttributesQuery = useDebounce(attributesQuery, 1500);
    const debouncedPriceFrom = useDebounce(priceFrom, 1500);
    const debouncedPriceTo = useDebounce(priceTo, 1500);

    const { isOpen, onOpen, onClose } = useDisclosure();

    const router = useRouter();
    const textColor = useColorModeValue('secondaryGray.900', 'white');
    const bgColor = useColorModeValue('white', 'secondaryGray.900');

    const createProduct = async () => {
        if (
            name == '' ||
            description == '' ||
            slug == '' ||
            shortDescription == ''
        )
            toast({
                title: 'One or more fields are empty!',
                status: 'error',
                duration: 2000,
                isClosable: true
            });
        else {
            const body = {
                name,
                description,
                slug,
                attributes,
                categoryIds: categories.map((c) => c.id),
                quantity: quantity,
                shortDescriptions: shortDescription,
                published,
                supplierId: supplier
            };

            console.log(body);

            const res = await fetch(`${router.basePath}/api/products/create`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${sessionStorage.adminToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });

            if (res.ok) {
                console.log('Product created', await res.json());
                toast({
                    title: 'Product created',
                    status: 'success',
                    duration: 2000,
                    isClosable: true
                });
                setTimeout(() => {
                    router.reload();
                }, 2000);
            } else {
                if (res.status == 401 || res.status == 403) {
                    // alert('Admin not logged in');
                    router.push(`/auth/admin/login?next=${router.pathname}`);
                }
                const data = await res.json();
                console.error(data.message);
                toast({
                    title: data.message,
                    status: 'error',
                    duration: 2000,
                    isClosable: true
                });
            }
        }
    };

    const editProduct = async () => {
        const updateData = {
            name,
            description,
            shortDescriptions: shortDescription,
            slug
        };

        if (Object.keys(attributes).length != 0) {
            updateData.attributes = attributes;
        }

        if (categories.length != 0) {
            updateData.categoryIds = categories.map((c) => c.id);
        }

        const body = {
            id,
            updateData
        };

        console.log(body);
        const res = await fetch(`${router.basePath}/api/products/update`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${sessionStorage.adminToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        if (res.ok) {
            console.log('Product updated', await res.json());

            toast({
                title: 'Product updated',
                status: 'success',
                duration: 2000,
                isClosable: true
            });
            setTimeout(() => {
                router.reload();
            }, 2000);
        } else {
            if (res.status == 401 || res.status == 403) {
                // alert('Admin not logged in');
                router.push(`/auth/admin/login?next=${router.pathname}`);
            }
            const data = await res.json();
            console.error(data.message);
            toast({
                title: data.message,
                status: 'error',
                duration: 2000,
                isClosable: true
            });
        }
    };

    const deleteProduct = async () => {
        if (id == '')
            toast({
                title: 'ID is missing!',
                status: 'error',
                duration: 2000,
                isClosable: true
            });
        else {
            const body = {
                id
            };

            const res = await fetch(`${router.basePath}/api/products/delete`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${sessionStorage.adminToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });

            if (res.ok) {
                console.log('Product deleted', await res.json());
                toast({
                    title: 'Category deleted',
                    status: 'success',
                    duration: 2000,
                    isClosable: true
                });
                setTimeout(() => {
                    router.reload();
                }, 2000);
            } else {
                if (res.status == 401 || res.status == 403) {
                    // alert('Admin not logged in');
                    router.push(`/auth/admin/login?next=${router.pathname}`);
                }
                const data = await res.json();
                console.error(data.message);
                toast({
                    title: data.message,
                    status: 'error',
                    duration: 2000,
                    isClosable: true
                });
            }
        }
    };

    const handler = {
        create: createProduct,
        edit: editProduct,
        delete: deleteProduct
    };

    const resetForm = () => {
        setName('');
        setDescription('');
        setSlug('');
        setCategories([]);
        setAttributeFields([0]);
        setAttributeList({ 0: ['', ''] });
        setAttributes({});
        setQuantity(0);
        setShortDescription('');
        setSupplier('');
        setPublished(false);
        onClose();
    };

    const openForm = async () => {
        await fetch(`${router.basePath}/api/products/category`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${sessionStorage.adminToken}`
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

        await fetch(`${router.basePath}/api/products/attribute`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${sessionStorage.adminToken}`
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

        onOpen();
    };

    useEffect(() => {
        let attr = {};
        Object.keys(attributeList).forEach((element) => {
            if (
                attributeList[element][0] != '' &&
                attributeList[element][1] != ''
            )
                attr[attributeList[element][0]] =
                    attributeList[element][1].split(/[,\s]+/);
        });
        setAttributes(attr);
    }, [attributeList]);

    const openEdit = (cells) => {
        setModalHeading('Edit Product');
        setModalBody('edit');
        setModalFooter('Update');
        setID(cells[0].value);

        setName(cells[1].value);
        setDescription(cells[2].value);
        setShortDescription(cells[3].value);
        setSlug(cells[4].value);
        setQuantity(cells[5].value);
        setPublished(cells[6].value);
        setSupplier(cells[7].value);

        openForm();
    };

    const openDelete = (cells) => {
        setModalHeading('Delete Product');
        setModalBody('delete');
        setModalFooter('Delete');
        setID(cells[0].value);
        onOpen();
    };

    const addCategory = (category, index) => {
        setAvailableCategories((prev) => {
            return prev.filter((val) => {
                return val.id !== category.id;
            });
        });

        setCategories((prev) => [...prev, category]);
    };

    const removeCategory = (category, index) => {
        setAvailableCategories((prev) => [...prev, category]);

        setCategories((prev) => {
            return prev.filter((val) => {
                return val.id !== category.id;
            });
        });
    };

    useEffect(() => {
        if (!sessionStorage.adminToken) {
            toast({
                title: 'Unauthorised admin',
                status: 'error',
                duration: 2000,
                isClosable: true
            });

            router.push(`/auth/admin/login?next=${router.pathname}`);
        } else {
            let query = {},
                rest = '';

            const accepted_values = [
                'id',
                'inStock',
                'published',
                'supplierId',
                'priceFrom',
                'priceTo'
            ];

            const q = debouncedSearchString.split(/\s+/);

            q.forEach((e) => {
                let a = e.split(':');
                if (a.length == 2 && accepted_values.indexOf(a[0]) != -1) {
                    if (a[0] == 'inStock' || a[0] == 'published') {
                        query[a[0]] = a[1] == 'true';
                    } else if (a[0] == 'priceFrom' || a[0] == 'priceTo') {
                        try {
                            query[a[0]] = parseInt(a[1], 10);
                        } catch (err) {
                            toast({
                                title: err.message,
                                status: 'error',
                                duration: 2000,
                                isClosable: true
                            });
                        }
                    } else query[a[0]] = a[1];
                } else {
                    if (rest != '') rest += ' ';
                    rest += e;
                }
            });

            if (rest) {
                query.query = rest;
            }

            if (debouncedCategoryQuery != '') {
                query.categoryId = debouncedCategoryQuery.id;
            }

            if (debouncedAttributesQuery != {}) {
                query.attributes = debouncedAttributesQuery;
            }

            if (debouncedPriceFrom > 0) {
                query.priceFrom = debouncedPriceFrom;
            }

            if (debouncedPriceTo > 0) {
                query.priceTo = debouncedPriceTo;
            }

            if (tenants.length != 0) {
                query.supplierIds = tenants;
            }

            console.log(query);
            fetch(`${router.basePath}/api/products`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${sessionStorage.adminToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(query)
            })
                .then(async (res) => {
                    const res_data = await res.json();
                    if (res.ok) {
                        console.log(res_data);
                        return res_data;
                    }

                    if (res.status == 403 || res.status == 401) {
                        // alert('Admin not logged in...');
                        toast({
                            title: 'Unauthorised admin',
                            status: 'error',
                            duration: 2000,
                            isClosable: true
                        });
                        router.push(
                            `/auth/admin/login?next=${router.pathname}`
                        );
                    }

                    if (res.status == 404) {
                        console.log(res_data.message);
                        toast({
                            title: res_data.message,
                            status: 'error',
                            duration: 2000,
                            isClosable: true
                        });
                        return { products: [] };
                    }
                    throw new Error(res_data.message);
                })
                .then((res) => {
                    setData(res.products);
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
        }
    }, [
        router,
        debouncedSearchString,
        toast,
        debouncedAttributesQuery,
        debouncedCategoryQuery,
        debouncedPriceFrom,
        debouncedPriceTo,
        tenants
    ]);

    useEffect(() => {
        if (localStorage.getItem('page/admin/products'))
            setPage(parseInt(localStorage.getItem('page/admin/products'), 10));
    }, []);

    return (
        <>
            <Layout
                heading="Products"
                searchString={searchString}
                setSearchString={setSearchString}
                placeholder="e.g. hello isRoot:true id:62bad0b6f4b8ec8aad5ced34"
            >
                <IconButton
                    colorScheme="telegram"
                    onClick={() => router.push('/admin/products/create')}
                    rounded="full"
                    w="70px"
                    h="70px"
                    position="fixed"
                    right="40px"
                    bottom="40px"
                    zIndex="1"
                    boxShadow="lg"
                >
                    <AddIcon />
                </IconButton>
                <Facet
                    category={categoryQuery}
                    attributes={attributesQuery}
                    setCategory={setCategoryQuery}
                    setAttributes={setAttributesQuery}
                    priceFrom={priceFrom}
                    priceTo={priceTo}
                    setPriceFrom={setPriceFrom}
                    setPriceTo={setPriceTo}
                    token={
                        typeof window !== 'undefined'
                            ? sessionStorage.adminToken
                            : ''
                    }
                    tenants={tenants}
                    setTenants={setTenants}
                    showTenantSelect
                />

                <TableComp
                    editEntry={openEdit}
                    deleteEntry={openDelete}
                    columnsData={columnsData}
                    tableData={data}
                    restore_page={page}
                />
            </Layout>
            {isOpen && (
                <Modal
                    scrollBehavior="inside"
                    size={modalBody == 'delete' ? 'md' : '2xl'}
                    isOpen={isOpen}
                    onClose={resetForm}
                >
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>{modalHeading}</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            {(modalBody == 'create' || modalBody == 'edit') && (
                                <>
                                    <Text fontSize="14px" fontWeight={500}>
                                        {modalBody == 'create'
                                            ? 'Name*'
                                            : 'Name'}
                                    </Text>
                                    <Input
                                        mb="8px"
                                        value={name}
                                        onChange={(e) =>
                                            setName(e.target.value)
                                        }
                                    />
                                    <Text fontSize="14px" fontWeight={500}>
                                        {modalBody == 'create'
                                            ? 'Description*'
                                            : 'Description'}
                                    </Text>
                                    <Textarea
                                        mb="8px"
                                        value={description}
                                        onChange={(e) =>
                                            setDescription(e.target.value)
                                        }
                                    />
                                    <Text fontSize="14px" fontWeight={500}>
                                        {modalBody == 'create'
                                            ? 'Short description*'
                                            : 'Short description'}
                                    </Text>
                                    <Input
                                        mb="8px"
                                        value={shortDescription}
                                        onChange={(e) =>
                                            setShortDescription(e.target.value)
                                        }
                                    />
                                    <Text fontSize="14px" fontWeight={500}>
                                        {modalBody == 'create'
                                            ? 'Slug*'
                                            : 'Slug'}
                                    </Text>
                                    <Input
                                        mb="8px"
                                        value={slug}
                                        onChange={(e) =>
                                            setSlug(e.target.value)
                                        }
                                    />
                                    <Text fontSize="14px" fontWeight={500}>
                                        {modalBody == 'create'
                                            ? 'Quantity*'
                                            : 'Quantity'}
                                    </Text>
                                    <Input
                                        mb="8px"
                                        value={quantity}
                                        placeholder="0"
                                        type="number"
                                        onChange={(e) =>
                                            setQuantity(e.target.value)
                                        }
                                    />
                                    <Text fontSize="14px" fontWeight={500}>
                                        Supplier ID
                                    </Text>
                                    <Input
                                        mb="8px"
                                        value={supplier}
                                        isReadOnly={modalBody == 'edit'}
                                        onChange={(e) =>
                                            setSupplier(e.target.value)
                                        }
                                    />
                                    <Text fontSize="14px" fontWeight={500}>
                                        Categories
                                    </Text>
                                    <HStack wrap="wrap">
                                        {categories.map((category, index) => (
                                            <Tag
                                                m="8px"
                                                bgColor="blue.500"
                                                color="white"
                                                key={index}
                                            >
                                                <TagLabel>
                                                    {category.name}
                                                </TagLabel>
                                                <TagCloseButton
                                                    onClick={() =>
                                                        removeCategory(
                                                            category,
                                                            index
                                                        )
                                                    }
                                                />
                                            </Tag>
                                        ))}
                                    </HStack>
                                    <Menu isLazy closeOnSelect={false} mb="8px">
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
                                        <MenuList
                                            maxH="150px"
                                            overflowY="scroll"
                                        >
                                            {availableCategories.map(
                                                (category, index) => (
                                                    <MenuItem
                                                        onClick={() =>
                                                            addCategory(
                                                                category,
                                                                index
                                                            )
                                                        }
                                                        key={index}
                                                    >
                                                        {category.name}
                                                    </MenuItem>
                                                )
                                            )}
                                        </MenuList>
                                    </Menu>
                                    <Flex>
                                        <Box py="16px" pr="16px">
                                            <Text
                                                fontSize="14px"
                                                fontWeight={500}
                                            >
                                                Attributes
                                            </Text>
                                            <VStack spacing="8px">
                                                {attributeFields.map((af) => {
                                                    return (
                                                        <Flex my="8px" key={af}>
                                                            <Select
                                                                maxW="200px"
                                                                mr="8px"
                                                                onChange={(
                                                                    e
                                                                ) => {
                                                                    setAttributeList(
                                                                        (
                                                                            prev
                                                                        ) => ({
                                                                            ...prev,
                                                                            [af]: [
                                                                                e
                                                                                    .target
                                                                                    .options[
                                                                                    e
                                                                                        .target
                                                                                        .selectedIndex
                                                                                ]
                                                                                    .value,
                                                                                ''
                                                                            ]
                                                                        })
                                                                    );
                                                                }}
                                                                placeholder="Select attribute"
                                                            >
                                                                {availableAttributes.map(
                                                                    (
                                                                        att,
                                                                        index
                                                                    ) => (
                                                                        <option
                                                                            value={
                                                                                att.name
                                                                            }
                                                                            key={
                                                                                index
                                                                            }
                                                                        >
                                                                            {
                                                                                att.name
                                                                            }
                                                                        </option>
                                                                    )
                                                                )}
                                                            </Select>
                                                            <Input
                                                                maxW="200px"
                                                                value={
                                                                    attributeList[
                                                                        af
                                                                    ]
                                                                        ? attributeList[
                                                                              af
                                                                          ][1]
                                                                        : ''
                                                                }
                                                                onChange={(e) =>
                                                                    setAttributeList(
                                                                        (
                                                                            prev
                                                                        ) => ({
                                                                            ...prev,
                                                                            [af]: [
                                                                                prev[
                                                                                    af
                                                                                ][0],
                                                                                e
                                                                                    .target
                                                                                    .value
                                                                            ]
                                                                        })
                                                                    )
                                                                }
                                                            />
                                                        </Flex>
                                                    );
                                                })}
                                            </VStack>
                                            <Button
                                                my="16px"
                                                onClick={() =>
                                                    setAttributeFields(
                                                        (prev) => [
                                                            ...prev,
                                                            prev[
                                                                prev.length - 1
                                                            ] + 1
                                                        ]
                                                    )
                                                }
                                                colorScheme="blue"
                                                fontSize="14px"
                                            >
                                                Add
                                            </Button>
                                        </Box>
                                        <Box py="16px">
                                            <Text
                                                fontSize="14px"
                                                fontWeight={500}
                                            >
                                                Preview
                                            </Text>
                                            <Code
                                                p="16px"
                                                borderRadius="2xl"
                                                colorScheme="blue"
                                                variant="solid"
                                            >
                                                <pre>
                                                    {JSON.stringify(
                                                        attributes,
                                                        null,
                                                        2
                                                    )}
                                                </pre>
                                            </Code>
                                        </Box>
                                    </Flex>
                                    <Flex mb="8px">
                                        <Checkbox
                                            id="create-published"
                                            isChecked={published}
                                            onChange={() =>
                                                setPublished((prev) => !prev)
                                            }
                                        />
                                        <FormLabel
                                            m="0"
                                            htmlFor="create-published"
                                            ml="8px"
                                            fontSize="14px"
                                            fontWeight={500}
                                        >
                                            Published
                                        </FormLabel>
                                    </Flex>
                                </>
                            )}
                            {modalBody == 'delete' && (
                                <>
                                    <Text fontSize="14px" fontWeight={500}>
                                        Are you sure?
                                    </Text>
                                </>
                            )}
                        </ModalBody>

                        <ModalFooter>
                            <Button
                                fontSize={{ sm: '14px' }}
                                colorScheme="blue"
                                onClick={handler[modalBody]}
                            >
                                {modalFooter}
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            )}
        </>
    );
}
