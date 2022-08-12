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
    useColorModeValue
} from '@chakra-ui/react';

// Custom components
import DefaultAuth from '../../../ui/layouts/auth/Default.js';

// Assets
import { MdOutlineRemoveRedEye } from 'react-icons/md';
import { RiEyeCloseLine } from 'react-icons/ri';
import { stringify } from 'stylis';

function Register() {
    // Chakra color mode
    const textColor = useColorModeValue('navy.700', 'white');
    const textColorSecondary = 'gray.400';
    const textColorDetails = useColorModeValue('navy.700', 'secondaryGray.600');
    const brandStars = useColorModeValue('brand.500', 'brand.400');

    const [show, setShow] = useState(false);
    const [buttonText, setButtonText] = useState('Register');
    const [register, setCompState] = useState(0);
    let router = useRouter();

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

    const handleClick = () => setShow(!show);
    return (
        // <DefaultAuth illustrationBackground={'/auth.png'} image={'/auth.png'}>
        <Flex
            maxW={{ base: '100%', md: 'max-content' }}
            w="100%"
            // mx={{ base: 'auto', lg: '0px' }}
            // me="auto"
            h="100%"
            alignItems="start"
            justifyContent="center"
            mb={{ base: '30px', md: '60px' }}
            px={{ base: '25px', md: '0px' }}
            mt={{ base: '40px', md: '5vh' }}
            ml="20px"
            flexDirection="column"
        >
            <Box me="auto">
                <Heading color={textColor} fontSize="34px" mb="2px">
                    Register your company
                </Heading>
                <Text
                    mb="30px"
                    ms="4px"
                    color={textColorSecondary}
                    fontWeight="400"
                    fontSize="md"
                >
                    Enter the details to register!
                </Text>
            </Box>
            <Flex
                zIndex="2"
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
                        //   alert(JSON.stringify(values, null, 2));
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
                    {({ handleSubmit, errors, touched }) => (
                        <form>
                            <FormControl
                                mb="4px"
                                // isInvalid={!!errors.username && touched.username}
                            >
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

                            <FormControl
                                mb="4px"
                                // isInvalid={!!errors.username && touched.username}
                            >
                                <FormLabel
                                    ms="4px"
                                    fontSize="sm"
                                    fontWeight="500"
                                    color={textColor}
                                    display="flex"
                                >
                                    Description<Text color={brandStars}>*</Text>
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
                                    GST Number<Text color={brandStars}>*</Text>
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
                                {/* <Flex justifyContent="space-between" align="center" mb="24px">
                    <Link href="#">
                      <a>Forgot password?</a>
                    </Link>
                  </Flex> */}
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
                                <Field
                                    as={Input}
                                    isRequired={true}
                                    id="gstCertificate"
                                    name="gstCertificate"
                                    fontSize="sm"
                                    mb="6px"
                                    size="md"
                                    variant="auth"
                                />
                                <Button
                                    fontSize="sm"
                                    variant="brand"
                                    fontWeight="500"
                                    w="30%"
                                    h="27"
                                    mb="8px"
                                >
                                    Upload
                                </Button>
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
                                    PAN Number<Text color={brandStars}>*</Text>
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
                                            let panFormat = /^[a-zA-Z0-9]*$/;
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
                                    PAN Card<Text color={brandStars}>*</Text>
                                </FormLabel>
                                <Field
                                    as={Input}
                                    isRequired={true}
                                    id="panCard"
                                    name="panCard"
                                    fontSize="sm"
                                    mb="6px"
                                    size="md"
                                    variant="auth"
                                />
                                <Button
                                    fontSize="sm"
                                    variant="brand"
                                    fontWeight="500"
                                    w="30%"
                                    h="27"
                                    mb="8px"
                                >
                                    Upload
                                </Button>
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
                                            if (!value.match(aadharFormat)) {
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
                                    Aadhar Card<Text color={brandStars}>*</Text>
                                </FormLabel>
                                <Field
                                    as={Input}
                                    isRequired={true}
                                    id="aadharCard"
                                    name="aadharCard"
                                    fontSize="sm"
                                    mb="6px"
                                    size="md"
                                    variant="auth"
                                />
                                <Button
                                    fontSize="sm"
                                    variant="brand"
                                    fontWeight="500"
                                    w="30%"
                                    h="27"
                                    mb="8px"
                                >
                                    Upload
                                </Button>
                            </FormControl>

                            <FormControl>
                                {/* <Flex justifyContent="space-between" align="center" mb="24px">
                    <Link href="#">
                      <a>Forgot password?</a>
                    </Link>
                  </Flex> */}
                                <Button
                                    fontSize="sm"
                                    variant="brand"
                                    fontWeight="500"
                                    w="55%"
                                    h="37"
                                    mb="8px"
                                    mt="13px"
                                    ml="75px"
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
        // </DefaultAuth>
    );
}

export default Register;
