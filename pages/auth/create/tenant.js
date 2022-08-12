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
    const [dashboard, setDashboard] = useState(0);
    let router = useRouter();

    useEffect(() => {
        if (!sessionStorage.userToken) {
            alert('Login first !');
            router.push('/auth/login');
        } else if (
            sessionStorage.company === 'ok' &&
            sessionStorage.tenant === 'ok'
        ) {
            alert('Tenant already registered !');
            router.push('/auth/dashboard');
        } else if (!sessionStorage.company) {
            alert('Register your company first');
            router.push('/auth/create/company');
        }
        if (dashboard === 1) {
            sessionStorage.setItem('tenant', 'ok');
            router.push('/dashboard');
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
            mt={{ base: '40px', md: '14vh' }}
            ml="20px"
            flexDirection="column"
        >
            <Box me="auto">
                <Heading color={textColor} fontSize="34px" mb="2px" mt="-45px">
                    Register your tenant
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
                        description: ''
                    }}
                    onSubmit={(values) => {
                        //   alert(JSON.stringify(values, null, 2));
                        setButtonText('Registering the tenant...');
                        fetch('/api/tenant/create', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${sessionStorage.userToken}`
                            },
                            body: JSON.stringify(values, null, 4)
                        })
                            .then((res) => res.json())
                            .then((res) => {
                                if (res.message === 'New Tenant Created') {
                                    setButtonText('Registered');
                                    setDashboard(1);
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
                    }}
                >
                    {({ handleSubmit, errors, touched }) => (
                        <form>
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
                                    Tenant Name<Text color={brandStars}>*</Text>
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
                                        validate={(value) => {
                                            let error;
                                            if (value.length == 0) {
                                                error =
                                                    "Tenant Name can't be an empty string";
                                            }
                                            return error;
                                        }}
                                    />
                                </InputGroup>
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
                                        validate={(value) => {
                                            let error;
                                            if (value.length == 0) {
                                                error =
                                                    "Description can't be empty";
                                            }
                                            return error;
                                        }}
                                    />
                                </InputGroup>
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
        /* </DefaultAuth>  */
    );
}

export default Register;
