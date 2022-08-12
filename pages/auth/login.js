import React from 'react';
import Link from 'next/link';

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
import DefaultAuth from '../../ui/layouts/auth/Default.js';

// Assets
import { MdOutlineRemoveRedEye } from 'react-icons/md';
import { RiEyeCloseLine } from 'react-icons/ri';
import { useRouter } from 'next/router.js';
import { useEffect } from 'react';
import { useState } from 'react';

function Login() {
    // Chakra color mode
    const textColor = useColorModeValue('navy.700', 'white');
    const textColorSecondary = 'gray.400';
    const textColorDetails = useColorModeValue('navy.700', 'secondaryGray.600');
    const brandStars = useColorModeValue('brand.500', 'brand.400');

    const toast = useToast();
    const [status, setStatus] = useState('success');

    const [show, setShow] = React.useState(false);
    const [buttonText, setButtonText] = React.useState('Sign in');
    const [company, setCompany] = React.useState(0);
    const router = useRouter();
    useEffect(() => {
        sessionStorage.clear();
    }, []);

    useEffect(() => {
        const keyDownHandler = (event) => {
            if (event.key === 'Enter') {
                document.getElementById('12').click();
            }
        };

        document.addEventListener('keydown', keyDownHandler);

        return () => {
            document.removeEventListener('keydown', keyDownHandler);
        };
    });
    useEffect(() => {
        if (company === 1) {
            router.push('/auth/create/tenant');
        } else if (company === 2) {
            router.push('/auth/create/company');
        } else if (company === 3) {
            router.push('/dashboard');
        }
    });

    const handleClick = () => setShow(!show);

    function solve(token) {
        fetch('/api/user/progress', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        })
            .then((res) => res.json())
            .then((res) => {
                // console.log(res);
                if (res.progress.company && res.progress.tenant) {
                    sessionStorage.setItem('company', 'ok');
                    sessionStorage.setItem('tenant', 'ok');
                    sessionStorage.setItem('tenantId', res.progress.tenant.id);
                    setCompany(3);
                    return res;
                } else if (res.progress.company) {
                    setCompany(1);
                    sessionStorage.setItem('company', 'ok');
                    return res;
                } else {
                    setCompany(2);
                    return res;
                }
            })
            // .then((res) => alert(res.message))
            .catch((err) => {
                console.error(JSON.parse(err.message));
            });
    }

    return (
        <DefaultAuth heading="Sign in">
            <Flex mx="auto" flexDirection="column">
                <Box me="auto">
                    <Heading color={textColor} fontSize="36px" mb="10px">
                        Sign In (User)
                    </Heading>
                    <Text
                        mb="36px"
                        ms="4px"
                        color={textColorSecondary}
                        fontWeight="400"
                        fontSize="md"
                    >
                        Enter your email and password to sign in!
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
                            email: '',
                            password: ''
                        }}
                        onSubmit={(values) => {
                            //   alert(JSON.stringify(values, null, 2));
                            setButtonText('Submitting...');
                            fetch('/api/user/login', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify(values, null, 2)
                            })
                                .then((res) => res.json())
                                .then((res) => {
                                    // console.log(res);
                                    if (res.message === 'User Authenticated') {
                                        sessionStorage.clear();
                                        // alert(res.message);
                                        // setStatus('success');
                                        toast({
                                            title: `${res.message}`,
                                            status: 'success',
                                            isClosable: true
                                        });
                                        setButtonText('User Authenticated');
                                        return res;
                                    } else {
                                        // sessionStorage.clear();
                                        // setStatus('error');
                                        toast({
                                            title: `${res.message}`,
                                            status: 'error',
                                            isClosable: true
                                        });
                                        setButtonText('Retry');
                                        throw new Error(
                                            JSON.stringify({
                                                message: res.message,
                                                status: res.status
                                            })
                                        );
                                    }
                                })
                                .then((res) => {
                                    if (res.message === 'User Authenticated') {
                                        sessionStorage.setItem(
                                            'userToken',
                                            res.updatedUser.token
                                        );
                                        solve(res.updatedUser.token);
                                    }
                                })
                                .catch((err) => {
                                    console.error(JSON.parse(err.message));
                                });
                        }}
                    >
                        {({ handleSubmit, errors, touched }) => (
                            <form>
                                <FormControl
                                    mb="24px"
                                    isInvalid={!!errors.email && touched.email}
                                >
                                    <FormLabel
                                        display="flex"
                                        ms="4px"
                                        fontSize="sm"
                                        fontWeight="500"
                                        color={textColor}
                                        mb="8px"
                                    >
                                        Email<Text color={brandStars}>*</Text>
                                    </FormLabel>
                                    <Field
                                        as={Input}
                                        isRequired={true}
                                        id="email"
                                        name="email"
                                        variant="auth"
                                        fontSize="sm"
                                        ms={{ base: '0px', md: '0px' }}
                                        type="email"
                                        placeholder="mail@simmmple.com"
                                        mb="4px"
                                        fontWeight="500"
                                        size="lg"
                                        validate={(value) => {
                                            let error;
                                            let mailformat =
                                                /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

                                            if (!value.match(mailformat)) {
                                                error =
                                                    'Please enter a valid email';
                                            }

                                            return error;
                                        }}
                                    />
                                    <FormErrorMessage>
                                        {errors.email}
                                    </FormErrorMessage>
                                </FormControl>
                                <FormControl
                                    mb="24px"
                                    isInvalid={
                                        !!errors.password && touched.password
                                    }
                                >
                                    <FormLabel
                                        ms="4px"
                                        fontSize="sm"
                                        fontWeight="500"
                                        color={textColor}
                                        display="flex"
                                    >
                                        Password
                                        <Text color={brandStars}>*</Text>
                                    </FormLabel>
                                    <InputGroup size="md">
                                        <Field
                                            as={Input}
                                            isRequired={true}
                                            id="password"
                                            name="password"
                                            fontSize="sm"
                                            placeholder="Min. 8 characters"
                                            mb="4px"
                                            size="lg"
                                            type={show ? 'text' : 'password'}
                                            variant="auth"
                                            validate={(value) => {
                                                let error;

                                                if (value.length < 7) {
                                                    error =
                                                        'Password must contain at least 8 characters';
                                                }

                                                return error;
                                            }}
                                        />
                                        <InputRightElement
                                            display="flex"
                                            alignItems="center"
                                            mt="4px"
                                        >
                                            <Icon
                                                color={textColorSecondary}
                                                _hover={{ cursor: 'pointer' }}
                                                as={
                                                    show
                                                        ? RiEyeCloseLine
                                                        : MdOutlineRemoveRedEye
                                                }
                                                onClick={handleClick}
                                            />
                                        </InputRightElement>
                                    </InputGroup>
                                    <FormErrorMessage>
                                        {errors.password}
                                    </FormErrorMessage>
                                </FormControl>
                                <FormControl>
                                    <Flex
                                        justifyContent="space-between"
                                        align="center"
                                        mb="24px"
                                    >
                                        <Link href="#">
                                            <a>Forgot password?</a>
                                        </Link>
                                    </Flex>
                                    <Button
                                        fontSize="sm"
                                        variant="brand"
                                        fontWeight="500"
                                        w="100%"
                                        h="50"
                                        mb="24px"
                                        id="12"
                                        onClick={handleSubmit}
                                    >
                                        {buttonText}
                                    </Button>
                                </FormControl>
                            </form>
                        )}
                    </Formik>
                    <Flex alignItems="start" maxW="100%" mt="0px">
                        <Text
                            color={textColorDetails}
                            fontWeight="400"
                            fontSize="14px"
                        >
                            Not registered yet?{' '}
                            <Link href="/auth/signup">
                                <a>
                                    <b>Create an Account</b>
                                </a>
                            </Link>
                        </Text>
                    </Flex>
                </Flex>
            </Flex>
        </DefaultAuth>
    );
}

export default Login;
