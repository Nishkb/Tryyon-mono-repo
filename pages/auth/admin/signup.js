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
    useColorModeValue
} from '@chakra-ui/react';

// Custom components
import DefaultAuth from '../../../ui/layouts/auth/Default';

// Assets
import { MdOutlineRemoveRedEye } from 'react-icons/md';
import { RiEyeCloseLine } from 'react-icons/ri';
import { stringify } from 'stylis';

function Signup() {
    // Chakra color mode
    const textColor = useColorModeValue('navy.700', 'white');
    const textColorSecondary = 'gray.400';
    const textColorDetails = useColorModeValue('navy.700', 'secondaryGray.600');
    const brandStars = useColorModeValue('brand.500', 'brand.400');

    const [show, setShow] = React.useState(false);
    const [buttonText, setButtonText] = React.useState('Sign up');

    const handleClick = () => setShow(!show);
    return (
        <DefaultAuth heading="Sign Up (Admin)">
            <Flex mx="auto" pb="20px" flexDirection="column">
                <Box me="auto">
                    <Heading
                        color={textColor}
                        fontSize="34px"
                        mb="2px"
                        mt="20px"
                    >
                        Sign Up (Admin)
                    </Heading>
                    <Text
                        mb="10px"
                        ms="4px"
                        color={textColorSecondary}
                        fontWeight="400"
                        fontSize="md"
                    >
                        Enter your details to sign up!
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
                            username: '',
                            firstname: '',
                            lastname: '',
                            email: '',
                            password: '',
                            phone: ''
                        }}
                        onSubmit={(values) => {
                            //   alert(JSON.stringify(values, null, 2));
                            setButtonText('Creating your account...');
                            let temp = parseInt(values.phone, 10);
                            values.phone = temp;
                            fetch('/api/admin/register', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify(values, null, 6)
                            })
                                .then((res) => res.json())
                                .then((res) => {
                                    if (
                                        res.message === 'New admin registered'
                                    ) {
                                        setButtonText('New Admin Registered');
                                        return res;
                                    } else {
                                        alert(res.message);
                                        setButtonText('Sign up again');
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
                            values.phone = '';
                            values.email = '';
                            values.password = '';
                            values.username = '';
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
                                        Username
                                        <Text color={brandStars}>*</Text>
                                    </FormLabel>
                                    <InputGroup size="md">
                                        <Field
                                            as={Input}
                                            isRequired={true}
                                            id="username"
                                            name="username"
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
                                        Firstname
                                        <Text color={brandStars}>*</Text>
                                    </FormLabel>
                                    <InputGroup size="md">
                                        <Field
                                            as={Input}
                                            isRequired={true}
                                            id="firstname"
                                            name="firstname"
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
                                        Lastname
                                        <Text color={brandStars}>*</Text>
                                    </FormLabel>
                                    <InputGroup size="md">
                                        <Field
                                            as={Input}
                                            isRequired={true}
                                            id="lastname"
                                            name="lastname"
                                            fontSize="sm"
                                            mb="2px"
                                            size="md"
                                            variant="auth"
                                        />
                                    </InputGroup>
                                </FormControl>

                                <FormControl
                                    mb="4px"
                                    isInvalid={!!errors.phone && touched.phone}
                                >
                                    <FormLabel
                                        display="flex"
                                        ms="4px"
                                        fontSize="sm"
                                        fontWeight="500"
                                        color={textColor}
                                        mb="5px"
                                    >
                                        Contact No.
                                        <Text color={brandStars}>*</Text>
                                    </FormLabel>
                                    <Field
                                        as={Input}
                                        isRequired={true}
                                        id="phone"
                                        name="phone"
                                        variant="auth"
                                        fontSize="sm"
                                        ms={{ base: '0px', md: '0px' }}
                                        type="phone"
                                        mb="2px"
                                        fontWeight="500"
                                        size="md"
                                        validate={(value) => {
                                            let error;
                                            let phoneFormat = /^[0-9]*$/;
                                            if (!value.match(phoneFormat)) {
                                                error =
                                                    'Phone number must contain only digits';
                                            }
                                            if (value.length !== 10) {
                                                error =
                                                    'Phone number must contain 10 digits';
                                            }
                                            return error;
                                        }}
                                    />
                                    <FormErrorMessage>
                                        {errors.phone}
                                    </FormErrorMessage>
                                </FormControl>

                                <FormControl
                                    mb="4px"
                                    isInvalid={!!errors.email && touched.email}
                                >
                                    <FormLabel
                                        display="flex"
                                        ms="4px"
                                        fontSize="sm"
                                        fontWeight="500"
                                        color={textColor}
                                        mb="5px"
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
                                        placeholder="mail@alphabi.co"
                                        mb="2px"
                                        fontWeight="500"
                                        size="md"
                                        validate={(value) => {
                                            let error;
                                            let mailformat =
                                                /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

                                            if (!value.match(mailformat)) {
                                                error =
                                                    'Please enter a valid email to register';
                                            }
                                            return error;
                                        }}
                                    />
                                    <FormErrorMessage>
                                        {errors.email}
                                    </FormErrorMessage>
                                </FormControl>

                                <FormControl
                                    mb="4px"
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
                                            mb="2px"
                                            size="md"
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
                                    <Button
                                        variant="brand"
                                        fontWeight="500"
                                        w="fit-content"
                                        mb="8px"
                                        mt="13px"
                                        onClick={handleSubmit}
                                    >
                                        {buttonText}
                                    </Button>
                                    <InputRightElement
                                        display="flex"
                                        alignItems="center"
                                        mt="20px"
                                    >
                                        <Flex
                                            alignItems="start"
                                            maxW="100%"
                                            mt="0px"
                                        >
                                            <Text
                                                color={textColorDetails}
                                                fontWeight="400"
                                                fontSize="14px"
                                            >
                                                Already registered?{' '}
                                                <Link href="/auth/admin/login">
                                                    <a>
                                                        <b>Sign In</b>
                                                    </a>
                                                </Link>
                                            </Text>
                                        </Flex>
                                    </InputRightElement>
                                </FormControl>
                            </form>
                        )}
                    </Formik>
                </Flex>
            </Flex>
        </DefaultAuth>
    );
}

export default Signup;
