import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router.js';
import { useEffect } from 'react';
import { useState } from 'react';

import { Formik, Field } from 'formik';

// Chakra imports
import {
    Box,
    Button,
    Flex,
    FormControl,
    FormLabel,
    FormErrorMessage,
    Heading,
    Icon,
    Input,
    InputGroup,
    InputRightElement,
    Text,
    useColorModeValue,
    useToast
} from '@chakra-ui/react';

// Custom components
import DefaultAuth from '../../../ui/layouts/auth/Default.js';

// Assets
import { MdOutlineRemoveRedEye } from 'react-icons/md';
import { RiEyeCloseLine } from 'react-icons/ri';
import { stringify } from 'stylis';
import FileInput from '../../../ui/components/FileInput/index.js';

function Register() {
    const toast = useToast();
    const router = useRouter();
    // Chakra color mode
    const textColor = useColorModeValue('navy.700', 'white');
    const textColorSecondary = 'gray.400';
    const textColorDetails = useColorModeValue('navy.700', 'secondaryGray.600');
    const brandStars = useColorModeValue('brand.500', 'brand.400');

    const [show, setShow] = useState(false);
    const [buttonText, setButtonText] = useState('Register');
    const [register, setCompState] = useState(0);

    useEffect(() => {
        if (!sessionStorage.userToken) {
            alert('Login first !');
            router.push('/auth/login');
        } else if (
            sessionStorage.company === 'ok' &&
            sessionStorage.tenant === 'ok'
        ) {
            alert('Company & Tenant already registered !');
            router.push('/auth/dashboard');
        } else if (sessionStorage.company === 'ok') {
            alert('Company already registered !');
            router.push('/auth/create/tenant');
        }
        if (register === 1) {
            sessionStorage.setItem('company', 'ok');
            router.push('/auth/create/tenant');
        }
    });

    return (
        <DefaultAuth heading="Register your company">
            <Flex py="30px" flexDirection="column">
                <Flex
                    direction="column"
                    w={{ base: '100%', md: '420px' }}
                    maxW="100%"
                    background="transparent"
                    borderRadius="15px"
                    mx={{ base: 'auto', lg: 'unset' }}
                    me="auto"
                    mb={{ base: '20px', md: 'auto' }}
                >
                    <Formik
                        initialValues={{
                            name: '',
                            description: '',
                            gstNumber: '',
                            gstCertificate: '',
                            panNumber: '',
                            panCard: '',
                            aadharNumber: '',
                            aadharCard: ''
                        }}
                        onSubmit={(values) => {
                            setButtonText('Registering the company...');
                            fetch('/api/company/create', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    Authorization: `Bearer ${sessionStorage.userToken}`
                                },
                                body: JSON.stringify(values, null, 5)
                            })
                                .then((res) => res.json())
                                .then((res) => {
                                    if (res.message === 'New Company Created') {
                                        setButtonText('Registered');
                                        setCompState(1);
                                        return res;
                                    } else {
                                        alert(res.message);
                                        setButtonText('Register again');
                                        throw new Error(
                                            JSON.stringify({
                                                message: res.message
                                            })
                                        );
                                    }
                                })
                                .then((res) => alert(res.message))
                                .catch((err) => {
                                    console.error(JSON.parse(err.message));
                                });
                            values.gstNumber = '';
                            values.panNumber = '';
                            values.aadharNumber = '';
                        }}
                    >
                        {({
                            handleSubmit,
                            errors,
                            touched,
                            setValues,
                            values
                        }) => (
                            <form>
                                <FormControl mb="4px">
                                    <FormLabel
                                        ms="4px"
                                        fontSize="sm"
                                        fontWeight="500"
                                        color={textColor}
                                        display="flex"
                                    >
                                        Company Name
                                        <Text color={brandStars}>*</Text>
                                    </FormLabel>
                                    <InputGroup size="md">
                                        <Field
                                            as={Input}
                                            isRequired={true}
                                            id="name"
                                            name="name"
                                            fontSize="sm"
                                            mb="2px"
                                            size="md"
                                            variant="auth"
                                        />
                                    </InputGroup>
                                </FormControl>

                                <FormControl mb="4px">
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
                                    <InputGroup size="md">
                                        <Field
                                            as={Input}
                                            isRequired={true}
                                            id="description"
                                            name="description"
                                            fontSize="sm"
                                            mb="2px"
                                            size="md"
                                            variant="auth"
                                        />
                                    </InputGroup>
                                </FormControl>

                                <FormControl
                                    mb="4px"
                                    isInvalid={
                                        !!errors.gstNumber && touched.gstNumber
                                    }
                                >
                                    <FormLabel
                                        ms="4px"
                                        fontSize="sm"
                                        fontWeight="500"
                                        color={textColor}
                                        display="flex"
                                    >
                                        GST Number
                                        <Text color={brandStars}>*</Text>
                                    </FormLabel>
                                    <InputGroup size="md">
                                        <Field
                                            as={Input}
                                            isRequired={true}
                                            id="gstNumber"
                                            name="gstNumber"
                                            fontSize="sm"
                                            mb="6px"
                                            size="md"
                                            variant="auth"
                                            validate={(value) => {
                                                let error;
                                                let gstFormat = /^[0-9]*$/;
                                                if (!value.match(gstFormat)) {
                                                    error =
                                                        'GST number must contain only digits';
                                                }
                                                if (value.length !== 15) {
                                                    error =
                                                        'GST number must contain 15 digits';
                                                }
                                                return error;
                                            }}
                                        />
                                    </InputGroup>
                                    <FormErrorMessage>
                                        {errors.gstNumber}
                                    </FormErrorMessage>
                                </FormControl>

                                <FormControl mb="4px">
                                    <FormLabel
                                        ms="4px"
                                        fontSize="sm"
                                        fontWeight="500"
                                        color={textColor}
                                        display="flex"
                                    >
                                        GST Certificate
                                        <Text color={brandStars}>*</Text>
                                    </FormLabel>
                                    <FileInput
                                        w="max-content"
                                        accept="application/pdf"
                                        colorScheme="blue"
                                        urlList={
                                            values.gstCertificate
                                                ? [values.gstCertificate]
                                                : []
                                        }
                                        onChange={(e) => {
                                            if (
                                                e.target.files[0].size > 2097152
                                            ) {
                                                toast({
                                                    title: `File ${e.target.files[0].name} is too large`,
                                                    status: 'error',
                                                    isClosable: true
                                                });
                                            } else {
                                                const fileData = new FormData();
                                                fileData.append(
                                                    'image',
                                                    e.target.files[0]
                                                );
                                                fetch('/api/upload/', {
                                                    method: 'POST',
                                                    headers: {
                                                        Authorization: `Bearer ${sessionStorage.userToken}`
                                                    },
                                                    body: fileData
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
                                                                message:
                                                                    err.message
                                                            })
                                                        );
                                                    })
                                                    .then((res) => {
                                                        console.log(res.body);
                                                        setValues((prev) => ({
                                                            ...prev,
                                                            gstCertificate:
                                                                res.body.key.split(
                                                                    '.'
                                                                )[0]
                                                        }));
                                                    })
                                                    .catch((err) => {
                                                        toast({
                                                            title: err.message,
                                                            status: 'error',
                                                            isClosable: true
                                                        });

                                                        console.error(
                                                            err.message
                                                        );
                                                    });
                                            }
                                        }}
                                    />
                                </FormControl>

                                <FormControl
                                    mb="4px"
                                    isInvalid={
                                        !!errors.panNumber && touched.panNumber
                                    }
                                >
                                    <FormLabel
                                        ms="4px"
                                        fontSize="sm"
                                        fontWeight="500"
                                        color={textColor}
                                        display="flex"
                                    >
                                        PAN Number
                                        <Text color={brandStars}>*</Text>
                                    </FormLabel>
                                    <InputGroup size="md">
                                        <Field
                                            as={Input}
                                            isRequired={true}
                                            id="panNumber"
                                            name="panNumber"
                                            fontSize="sm"
                                            mb="6px"
                                            size="md"
                                            variant="auth"
                                            validate={(value) => {
                                                let error;
                                                let panFormat =
                                                    /^[a-zA-Z0-9]*$/;
                                                if (!value.match(panFormat)) {
                                                    error =
                                                        'PAN number must contain only alphanumeric characters';
                                                }
                                                if (value.length !== 10) {
                                                    error =
                                                        'PAN number must contain 10 digits';
                                                }
                                                return error;
                                            }}
                                        />
                                    </InputGroup>
                                    <FormErrorMessage>
                                        {errors.panNumber}
                                    </FormErrorMessage>
                                </FormControl>

                                <FormControl mb="4px">
                                    <FormLabel
                                        ms="4px"
                                        fontSize="sm"
                                        fontWeight="500"
                                        color={textColor}
                                        display="flex"
                                    >
                                        PAN Card
                                        <Text color={brandStars}>*</Text>
                                    </FormLabel>
                                    <FileInput
                                        w="max-content"
                                        accept="application/pdf"
                                        colorScheme="blue"
                                        urlList={
                                            values.panCard
                                                ? [values.panCard]
                                                : []
                                        }
                                        onChange={(e) => {
                                            if (
                                                e.target.files[0].size > 2097152
                                            ) {
                                                toast({
                                                    title: `File ${e.target.files[0].name} is too large`,
                                                    status: 'error',
                                                    isClosable: true
                                                });
                                            } else {
                                                const fileData = new FormData();
                                                fileData.append(
                                                    'image',
                                                    e.target.files[0]
                                                );
                                                fetch('/api/upload/', {
                                                    method: 'POST',
                                                    headers: {
                                                        Authorization: `Bearer ${sessionStorage.userToken}`
                                                    },
                                                    body: fileData
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
                                                                message:
                                                                    err.message
                                                            })
                                                        );
                                                    })
                                                    .then((res) => {
                                                        console.log(res.body);
                                                        setValues((prev) => ({
                                                            ...prev,
                                                            panCard:
                                                                res.body.key.split(
                                                                    '.'
                                                                )[0]
                                                        }));
                                                    })
                                                    .catch((err) => {
                                                        toast({
                                                            title: err.message,
                                                            status: 'error',
                                                            isClosable: true
                                                        });

                                                        console.error(
                                                            err.message
                                                        );
                                                    });
                                            }
                                        }}
                                    />
                                </FormControl>

                                <FormControl
                                    mb="4px"
                                    isInvalid={
                                        !!errors.aadharNumber &&
                                        touched.aadharNumber
                                    }
                                >
                                    <FormLabel
                                        ms="4px"
                                        fontSize="sm"
                                        fontWeight="500"
                                        color={textColor}
                                        display="flex"
                                    >
                                        Aadhar Number
                                        <Text color={brandStars}>*</Text>
                                    </FormLabel>
                                    <InputGroup size="md">
                                        <Field
                                            as={Input}
                                            isRequired={true}
                                            id="aadharNumber"
                                            name="aadharNumber"
                                            fontSize="sm"
                                            mb="6px"
                                            size="md"
                                            variant="auth"
                                            validate={(value) => {
                                                let error;
                                                let aadharFormat = /^[0-9]*$/;
                                                if (
                                                    !value.match(aadharFormat)
                                                ) {
                                                    error =
                                                        'Aadhar number must contain only digits';
                                                }
                                                if (value.length !== 12) {
                                                    error =
                                                        'Aadhar number must contain 12 digits';
                                                }
                                                return error;
                                            }}
                                        />
                                    </InputGroup>
                                    <FormErrorMessage>
                                        {errors.aadharNumber}
                                    </FormErrorMessage>
                                </FormControl>

                                <FormControl mb="4px">
                                    <FormLabel
                                        ms="4px"
                                        fontSize="sm"
                                        fontWeight="500"
                                        color={textColor}
                                        display="flex"
                                    >
                                        Aadhar Card
                                        <Text color={brandStars}>*</Text>
                                    </FormLabel>
                                    <FileInput
                                        w="max-content"
                                        accept="application/pdf"
                                        colorScheme="blue"
                                        urlList={
                                            values.aadharCard
                                                ? [values.aadharCard]
                                                : []
                                        }
                                        onChange={(e) => {
                                            if (
                                                e.target.files[0].size > 2097152
                                            ) {
                                                toast({
                                                    title: `File ${e.target.files[0].name} is too large`,
                                                    status: 'error',
                                                    isClosable: true
                                                });
                                            } else {
                                                const fileData = new FormData();
                                                fileData.append(
                                                    'image',
                                                    e.target.files[0]
                                                );
                                                fetch('/api/upload/', {
                                                    method: 'POST',
                                                    headers: {
                                                        Authorization: `Bearer ${sessionStorage.userToken}`
                                                    },
                                                    body: fileData
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
                                                                message:
                                                                    err.message
                                                            })
                                                        );
                                                    })
                                                    .then((res) => {
                                                        console.log(res.body);
                                                        setValues((prev) => ({
                                                            ...prev,
                                                            aadharCard:
                                                                res.body.key.split(
                                                                    '.'
                                                                )[0]
                                                        }));
                                                    })
                                                    .catch((err) => {
                                                        toast({
                                                            title: err.message,
                                                            status: 'error',
                                                            isClosable: true
                                                        });

                                                        console.error(
                                                            err.message
                                                        );
                                                    });
                                            }
                                        }}
                                    />
                                </FormControl>

                                <FormControl>
                                    <Button
                                        variant="brand"
                                        fontWeight="500"
                                        w="200px"
                                        mb="8px"
                                        mt="13px"
                                        onClick={handleSubmit}
                                    >
                                        {buttonText}
                                    </Button>
                                </FormControl>
                            </form>
                        )}
                    </Formik>
                </Flex>
            </Flex>
        </DefaultAuth>
    );
}

export default Register;
