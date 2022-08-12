import React, { useState, useEffect } from 'react';
import {
    Button,
    Flex,
    FormControl,
    FormLabel,
    FormErrorMessage,
    Input,
    Text,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Radio,
    RadioGroup,
    useToast,
    useColorModeValue
} from '@chakra-ui/react';

import { Formik, Field } from 'formik';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { useRouter } from 'next/router';
import FileInput from '../FileInput';

function BasicForm({ onSubmit, token }) {
    const router = useRouter();
    const toast = useToast();

    const textColor = useColorModeValue('navy.700', 'white');
    const brandStars = useColorModeValue('brand.500', 'brand.400');
    const bgColor = useColorModeValue('white', 'navy.800');

    const [availableLocations, setAvailableLocations] = useState([]);
    const [tenants, setTenants] = useState([]);

    const [locations, setLocations] = useState('');

    const [supplier, setSupplier] = useState('');
    const [supplierName, setSupplierName] = useState('Select Supplier');

    useEffect(() => {
        fetch('/api/tenant/', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then((res) => {
                if (res.ok) {
                    return res.json();
                }

                if (res.status == 401 || res.status == 403) {
                    router.push(`/auth/admin/login?next=${router.pathname}`);

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

        fetch('/api/location/', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then((res) => {
                if (res.ok) {
                    return res.json();
                }

                if (res.status == 401 || res.status == 403) {
                    router.push(`/auth/admin/login?next=${router.pathname}`);

                    throw new Error(
                        JSON.stringify({
                            message: 'Uauthorised Admin'
                        })
                    );
                }

                const err = res.json();

                throw new Error(
                    JSON.stringify({
                        message: err.message
                    })
                );
            })
            .then((res) => {
                setAvailableLocations(res.locations);
            })
            .catch((err) => {
                console.error(err.message);
                toast({
                    title: err.message,
                    status: 'error',
                    isClosable: true
                });
            });
    }, [toast, router, token]);

    return (
        <Formik
            initialValues={{
                name: '',
                description: '',
                shortDescriptions: '',
                quantity: 0,
                price: 0,
                discountedPrice: 0,
                slug: '',
                manufacturer: '',
                countryOfOrigin: '',
                featuredFrom: '',
                featuredTo: '',
                featureImage: '',
                gallery: []
            }}
            onSubmit={(values) => {
                if (supplier == '') {
                    toast({
                        title: 'Supplier not selected',
                        isClosable: true,
                        status: 'error'
                    });

                    console.error('Supplier not selected');
                } else if (locations.length != 1) {
                    toast({
                        title: 'Location not selected',
                        isClosable: true,
                        status: 'error'
                    });

                    console.error('Location not selected');
                } else
                    onSubmit({
                        ...values,
                        supplierId: supplier,
                        locationIds: locations
                    });
            }}
        >
            {({ handleSubmit, errors, touched, values, setValues }) => (
                <form>
                    <Flex direction="column" gap="16px">
                        <Flex h="max-content" direction="column">
                            <FormControl
                                mb="4px"
                                isInvalid={!!errors.name && touched.name}
                            >
                                <FormLabel
                                    ms="4px"
                                    fontSize="sm"
                                    fontWeight="500"
                                    color={textColor}
                                    display="flex"
                                >
                                    Name
                                    <Text color={brandStars}>*</Text>
                                </FormLabel>
                                <Field
                                    as={Input}
                                    isRequired={true}
                                    id="name"
                                    name="name"
                                    variant="auth"
                                    fontSize="sm"
                                    mb="3px"
                                    fontWeight="500"
                                    size="md"
                                    validate={(value) => {
                                        let error;
                                        if (value.length === 0) {
                                            error = 'Field can not be empty';
                                        }
                                        return error;
                                    }}
                                />
                                <FormErrorMessage>
                                    {errors.name}
                                </FormErrorMessage>
                            </FormControl>

                            <FormControl
                                mb="4px"
                                isInvalid={
                                    !!errors.description && touched.description
                                }
                            >
                                <FormLabel
                                    ms="4px"
                                    fontSize="sm"
                                    fontWeight="500"
                                    color={textColor}
                                    display="flex"
                                >
                                    Description
                                    <Text color={brandStars}>*</Text>
                                </FormLabel>
                                <Field
                                    as={Input}
                                    isRequired={true}
                                    id="description"
                                    name="description"
                                    variant="auth"
                                    fontSize="sm"
                                    mb="3px"
                                    fontWeight="500"
                                    size="md"
                                    validate={(value) => {
                                        let error;
                                        if (value.length === 0) {
                                            error = 'Field can not be empty';
                                        }
                                        return error;
                                    }}
                                />
                                <FormErrorMessage>
                                    {errors.description}
                                </FormErrorMessage>
                            </FormControl>

                            <FormControl
                                mb="4px"
                                isInvalid={
                                    !!errors.shortDescriptions &&
                                    touched.shortDescriptions
                                }
                            >
                                <FormLabel
                                    ms="4px"
                                    fontSize="sm"
                                    fontWeight="500"
                                    color={textColor}
                                    display="flex"
                                >
                                    Short Description
                                    <Text color={brandStars}>*</Text>
                                </FormLabel>
                                <Field
                                    as={Input}
                                    isRequired={true}
                                    id="shortDescriptions"
                                    name="shortDescriptions"
                                    variant="auth"
                                    fontSize="sm"
                                    mb="3px"
                                    fontWeight="500"
                                    size="md"
                                    validate={(value) => {
                                        let error;
                                        if (value.length === 0) {
                                            error = 'Field can not be empty';
                                            return error;
                                        }
                                        if (
                                            value.length >=
                                            values.description.length
                                        ) {
                                            error =
                                                'It should be less than the main description';
                                        }
                                        return error;
                                    }}
                                />
                                <FormErrorMessage>
                                    {errors.shortDescriptions}
                                </FormErrorMessage>
                                {/* </InputGroup> */}
                            </FormControl>

                            <FormControl
                                mb="4px"
                                isInvalid={!!errors.slug && touched.slug}
                            >
                                <FormLabel
                                    ms="4px"
                                    fontSize="sm"
                                    fontWeight="500"
                                    color={textColor}
                                    display="flex"
                                >
                                    Slug
                                    <Text color={brandStars}>*</Text>
                                </FormLabel>
                                <Field
                                    as={Input}
                                    isRequired={true}
                                    id="slug"
                                    name="slug"
                                    variant="auth"
                                    fontSize="sm"
                                    mb="3px"
                                    fontWeight="500"
                                    size="md"
                                    validate={(value) => {
                                        let error;
                                        if (value.length === 0) {
                                            error = 'Field can not be empty';
                                        }
                                        return error;
                                    }}
                                />
                                <FormErrorMessage>
                                    {errors.slug}
                                </FormErrorMessage>
                            </FormControl>

                            <FormControl
                                mb="4px"
                                isInvalid={
                                    !!errors.quantity && touched.quantity
                                }
                            >
                                <FormLabel
                                    display="flex"
                                    ms="4px"
                                    fontSize="sm"
                                    fontWeight="500"
                                    color={textColor}
                                    mb="5px"
                                >
                                    Quantity
                                    <Text color={brandStars}>*</Text>
                                </FormLabel>
                                <Field
                                    as={Input}
                                    isRequired={true}
                                    value={values.quantity}
                                    onChange={(e) =>
                                        setValues((prev) => ({
                                            ...prev,
                                            quantity:
                                                parseInt(
                                                    e.target.value
                                                ).toString() === 'NaN'
                                                    ? 0
                                                    : parseInt(e.target.value)
                                        }))
                                    }
                                    id="quantity"
                                    name="quantity"
                                    type="number"
                                    variant="auth"
                                    fontSize="sm"
                                    mb="3px"
                                    fontWeight="500"
                                    size="md"
                                    validate={(value) => {
                                        if (value == 0) {
                                            return 'Field can not be empty';
                                        }
                                    }}
                                />
                                <FormErrorMessage>
                                    {errors.quantity}
                                </FormErrorMessage>
                            </FormControl>

                            <FormControl
                                mb="4px"
                                isInvalid={!!errors.price && touched.price}
                            >
                                <FormLabel
                                    display="flex"
                                    ms="4px"
                                    fontSize="sm"
                                    fontWeight="500"
                                    color={textColor}
                                    mb="5px"
                                >
                                    Price
                                    <Text color={brandStars}>*</Text>
                                </FormLabel>
                                <Field
                                    as={Input}
                                    isRequired={true}
                                    value={values.price}
                                    onChange={(e) =>
                                        setValues((prev) => ({
                                            ...prev,
                                            price:
                                                parseInt(
                                                    e.target.value
                                                ).toString() === 'NaN'
                                                    ? 0
                                                    : parseInt(e.target.value)
                                        }))
                                    }
                                    id="price"
                                    name="price"
                                    variant="auth"
                                    type="number"
                                    fontSize="sm"
                                    mb="3px"
                                    fontWeight="500"
                                    size="md"
                                    validate={(value) => {
                                        if (value == 0) {
                                            return 'Field can not be empty';
                                        }
                                    }}
                                />
                                <FormErrorMessage>
                                    {errors.price}
                                </FormErrorMessage>
                            </FormControl>

                            <FormControl
                                mb="4px"
                                isInvalid={
                                    !!errors.discountedPrice &&
                                    touched.discountedPrice
                                }
                            >
                                <FormLabel
                                    display="flex"
                                    ms="4px"
                                    fontSize="sm"
                                    fontWeight="500"
                                    color={textColor}
                                    mb="5px"
                                >
                                    Discounted Price
                                    <Text color={brandStars}>*</Text>
                                </FormLabel>
                                <Field
                                    as={Input}
                                    isRequired={true}
                                    value={values.discountedPrice}
                                    onChange={(e) =>
                                        setValues((prev) => ({
                                            ...prev,
                                            discountedPrice:
                                                parseInt(
                                                    e.target.value
                                                ).toString() === 'NaN'
                                                    ? 0
                                                    : parseInt(e.target.value)
                                        }))
                                    }
                                    id="discountedPrice"
                                    name="discountedPrice"
                                    variant="auth"
                                    type="number"
                                    fontSize="sm"
                                    mb="3px"
                                    fontWeight="500"
                                    size="md"
                                    validate={(value) => {
                                        if (value == 0) {
                                            return 'Field cannot be empty';
                                        }
                                        if (value > values.price) {
                                            return 'Discounted price cannot be greater than price';
                                        }
                                    }}
                                />
                                <FormErrorMessage>
                                    {errors.discountedPrice}
                                </FormErrorMessage>
                            </FormControl>

                            <FormControl
                                mb="4px"
                                isInvalid={
                                    !!errors.manufacturer &&
                                    touched.manufacturer
                                }
                            >
                                <FormLabel
                                    ms="4px"
                                    fontSize="sm"
                                    fontWeight="500"
                                    color={textColor}
                                    display="flex"
                                >
                                    Manufacturer
                                    <Text color={brandStars}>*</Text>
                                </FormLabel>
                                <Field
                                    as={Input}
                                    isRequired={true}
                                    id="manufacturer"
                                    name="manufacturer"
                                    variant="auth"
                                    fontSize="sm"
                                    mb="3px"
                                    fontWeight="500"
                                    size="md"
                                    validate={(value) => {
                                        let error;
                                        if (value.length === 0) {
                                            error = 'Field can not be empty';
                                        }
                                        return error;
                                    }}
                                />
                                <FormErrorMessage>
                                    {errors.manufacturer}
                                </FormErrorMessage>
                            </FormControl>

                            <FormControl
                                mb="4px"
                                isInvalid={
                                    !!errors.countryOfOrigin &&
                                    touched.countryOfOrigin
                                }
                            >
                                <FormLabel
                                    ms="4px"
                                    fontSize="sm"
                                    fontWeight="500"
                                    color={textColor}
                                    display="flex"
                                >
                                    Country of Origin
                                    <Text color={brandStars}>*</Text>
                                </FormLabel>
                                <Field
                                    as={Input}
                                    isRequired={true}
                                    id="countryOfOrigin"
                                    name="countryOfOrigin"
                                    variant="auth"
                                    fontSize="sm"
                                    mb="3px"
                                    fontWeight="500"
                                    size="md"
                                    validate={(value) => {
                                        let error;
                                        if (value.length === 0) {
                                            error = 'Field can not be empty';
                                        }
                                        return error;
                                    }}
                                />
                                <FormErrorMessage>
                                    {errors.countryOfOrigin}
                                </FormErrorMessage>
                            </FormControl>

                            <FormControl
                                mb="4px"
                                isInvalid={
                                    !!errors.featuredFrom &&
                                    touched.featuredFrom
                                }
                            >
                                <FormLabel
                                    ms="4px"
                                    fontSize="sm"
                                    fontWeight="500"
                                    color={textColor}
                                    display="flex"
                                >
                                    Featured From
                                    <Text color={brandStars}>*</Text>
                                </FormLabel>
                                <Field
                                    as={Input}
                                    type="datetime-local"
                                    isRequired={true}
                                    id="featuredFrom"
                                    name="featuredFrom"
                                    variant="auth"
                                    fontSize="sm"
                                    mb="3px"
                                    fontWeight="500"
                                    size="md"
                                    validate={(value) => {
                                        if (value == '') {
                                            return 'Field can not be empty';
                                        }
                                    }}
                                />
                                <FormErrorMessage>
                                    {errors.featuredFrom}
                                </FormErrorMessage>
                            </FormControl>

                            <FormControl
                                mb="4px"
                                isInvalid={
                                    !!errors.featuredTo && touched.featuredTo
                                }
                            >
                                <FormLabel
                                    ms="4px"
                                    fontSize="sm"
                                    fontWeight="500"
                                    color={textColor}
                                    display="flex"
                                >
                                    Featured To
                                    <Text color={brandStars}>*</Text>
                                </FormLabel>
                                <Field
                                    as={Input}
                                    type="datetime-local"
                                    isRequired={true}
                                    id="featuredTo"
                                    name="featuredTo"
                                    variant="auth"
                                    fontSize="sm"
                                    mb="3px"
                                    fontWeight="500"
                                    size="md"
                                    validate={(value) => {
                                        if (value == '') {
                                            return 'Field can not be empty';
                                        }
                                    }}
                                />
                                <FormErrorMessage>
                                    {errors.featuredTo}
                                </FormErrorMessage>
                            </FormControl>
                            <FormLabel
                                ms="4px"
                                fontSize="sm"
                                fontWeight="500"
                                color={textColor}
                                display="flex"
                            >
                                Supplier
                                <Text color={brandStars}>*</Text>
                            </FormLabel>
                            <Menu strategy="fixed">
                                <MenuButton
                                    as={Button}
                                    bgColor="transparent"
                                    fontWeight="400"
                                    minWidth="420px"
                                    border="1px"
                                    textAlign="left"
                                    fontSize="md"
                                    borderColor="blackAlpha.200"
                                >
                                    {supplierName}
                                    <ChevronDownIcon float="right" />
                                </MenuButton>
                                <MenuList>
                                    {/* MenuItems are not rendered unless Menu is open */}
                                    {tenants.map((obj, index) => (
                                        <MenuItem
                                            key={index}
                                            onClick={() => {
                                                setSupplier(obj.id);
                                                setSupplierName(obj.name);
                                            }}
                                        >
                                            {obj.name}
                                        </MenuItem>
                                    ))}
                                </MenuList>
                            </Menu>

                            <FormLabel
                                ms="4px"
                                mt="8px"
                                fontSize="sm"
                                fontWeight="500"
                                color={textColor}
                                display="flex"
                            >
                                Feature Image
                            </FormLabel>
                            <FileInput
                                w="max-content"
                                accept="image/*"
                                colorScheme="blue"
                                urlList={
                                    values.featureImage
                                        ? [values.featureImage]
                                        : []
                                }
                                onChange={(e) => {
                                    if (e.target.files[0].size > 2097152) {
                                        toast({
                                            title: `File ${e.target.files[0].name} is too large`,
                                            status: 'error',
                                            isClosable: true
                                        });
                                    } else {
                                        const imageData = new FormData();
                                        imageData.append(
                                            'image',
                                            e.target.files[0]
                                        );
                                        fetch('/api/upload/', {
                                            method: 'POST',
                                            headers: {
                                                Authorization: `Bearer ${sessionStorage.token_admin}`
                                            },
                                            body: imageData
                                        })
                                            .then((res) => {
                                                if (res.ok) {
                                                    return res.json();
                                                }

                                                if (
                                                    res.status == 401 ||
                                                    res.status == 403
                                                ) {
                                                    router.push(
                                                        `/auth/admin/login?next=${router.pathname}`
                                                    );
                                                    throw new Error(
                                                        JSON.stringify({
                                                            message:
                                                                'Unauthorized Admin'
                                                        })
                                                    );
                                                }

                                                const err = res.json();

                                                throw new Error(
                                                    JSON.stringify({
                                                        message: err.message
                                                    })
                                                );
                                            })
                                            .then((res) => {
                                                console.log(res.body);
                                                setValues((prev) => ({
                                                    ...prev,
                                                    featureImage:
                                                        res.body.location
                                                }));
                                            })
                                            .catch((err) => {
                                                toast({
                                                    title: err.message,
                                                    status: 'error',
                                                    isClosable: true
                                                });

                                                console.error(err.message);
                                            });
                                    }
                                }}
                            />

                            <FormLabel
                                ms="4px"
                                mt="8px"
                                fontSize="sm"
                                fontWeight="500"
                                color={textColor}
                                display="flex"
                            >
                                Gallery
                            </FormLabel>
                            <FileInput
                                accept="image/*"
                                w="max-content"
                                multiple
                                colorScheme="blue"
                                urlList={values.gallery}
                                onChange={(e) => {
                                    let flag = false;

                                    if (e.target.files.length > 5) {
                                        flag = true;
                                        toast({
                                            title: 'Only 5 images allowed at max',
                                            status: 'error',
                                            isClosable: true
                                        });
                                    }

                                    for (
                                        let i = 0;
                                        i < e.target.files.length;
                                        i++
                                    ) {
                                        if (e.target.files[i].size > 2097152) {
                                            flag = true;
                                            toast({
                                                title: `File ${e.target.files[i].name} is too large`,
                                                status: 'error',
                                                isClosable: true
                                            });
                                        }
                                    }

                                    if (!flag) {
                                        const imageData = new FormData();
                                        for (
                                            let i = 0;
                                            i < e.target.files.length;
                                            i++
                                        ) {
                                            imageData.append(
                                                'images',
                                                e.target.files[i]
                                            );
                                        }

                                        fetch('/api/upload/bulk', {
                                            method: 'POST',
                                            headers: {
                                                Authorization: `Bearer ${sessionStorage.token_admin}`
                                            },
                                            body: imageData
                                        })
                                            .then((res) => {
                                                if (res.ok) {
                                                    return res.json();
                                                }

                                                if (
                                                    res.status == 401 ||
                                                    res.status == 403
                                                ) {
                                                    router.push(
                                                        `/auth/admin/login?next=${router.pathname}`
                                                    );
                                                    throw new Error(
                                                        JSON.stringify({
                                                            message:
                                                                'Unauthorized Admin'
                                                        })
                                                    );
                                                }

                                                const err = res.json();

                                                throw new Error(
                                                    JSON.stringify({
                                                        message: err.message
                                                    })
                                                );
                                            })
                                            .then((res) => {
                                                console.log(res.body);
                                                setValues((prev) => ({
                                                    ...prev,
                                                    gallery: res.body.map(
                                                        (img) => img.location
                                                    )
                                                }));
                                            })
                                            .catch((err) => {
                                                toast({
                                                    title: err.message,
                                                    status: 'error',
                                                    isClosable: true
                                                });

                                                console.error(err.message);
                                            });
                                    }
                                }}
                            />
                            <FormLabel
                                ms="4px"
                                mt="8px"
                                mb="0px"
                                fontSize="sm"
                                fontWeight="500"
                                color={textColor}
                                display="flex"
                            >
                                Location
                                <Text color={brandStars}>*</Text>
                            </FormLabel>
                            <Flex>
                                <RadioGroup
                                    onChange={(value) => setLocations([value])}
                                >
                                    <Flex direction="column">
                                        {availableLocations.map(
                                            (item, index) => {
                                                return (
                                                    <Radio
                                                        key={index}
                                                        mt="10px"
                                                        w="max-content"
                                                        value={item.id}
                                                    >
                                                        {item.name}
                                                    </Radio>
                                                );
                                            }
                                        )}
                                    </Flex>
                                </RadioGroup>
                            </Flex>
                            <Button
                                maxW="max-content"
                                ml="auto"
                                mr="0"
                                mt="24px"
                                mb="8px"
                                colorScheme="blue"
                                onClick={handleSubmit}
                            >
                                Next
                            </Button>
                        </Flex>
                    </Flex>
                </form>
            )}
        </Formik>
    );
}

export default BasicForm;
