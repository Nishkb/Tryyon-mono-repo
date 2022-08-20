import React, { useEffect } from 'react';
import { useRouter } from 'next/router.js';
import { useState } from 'react';

import { Formik, Field } from 'formik';

// Chakra imports
import {
    Button,
    Flex,
    FormControl,
    FormLabel,
    Icon,
    Input,
    InputGroup,
    Text,
    useToast,
    useColorModeValue,
    InputRightElement,
    useBoolean
} from '@chakra-ui/react';

// Custom components
import DefaultAuth from '../../ui/layouts/auth/Default.js';
import { RiEyeFill } from 'react-icons/ri';

function ChangePassword() {
    // Chakra color mode
    const textColor = useColorModeValue('navy.700', 'white');
    const brandStars = useColorModeValue('brand.500', 'brand.400');

    const [buttonText, setButtonText] = useState('Change password');
    const router = useRouter();
    const toast = useToast();
    const [code, setCode] = useState('');
    const [show, setShow] = useBoolean(false);

    useEffect(() => {
        setCode(router.query.code);
        console.log(router.query);
    }, [router]);

    return (
        <DefaultAuth heading="Change password">
            <Flex
                maxW={{ base: '100%', md: 'max-content' }}
                w="100%"
                h="100%"
                mt="40px"
                flexDirection="column"
            >
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
                            password: ''
                        }}
                        onSubmit={(values) => {
                            setButtonText('Changing password...');
                            fetch('/api/user/password-change', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    Authorization: `Bearer ${sessionStorage.userToken}`
                                },
                                body: JSON.stringify(
                                    { ...values, code },
                                    null,
                                    4
                                )
                            })
                                .then(async (res) => {
                                    if (res.ok) {
                                        setButtonText('Password changed');
                                        return await res.json();
                                    }

                                    if (
                                        res.status == '401' ||
                                        res.status == '403'
                                    ) {
                                        toast({
                                            title: 'Unauthorized access',
                                            isClosable: true,
                                            status: 'error'
                                        });

                                        router.push(
                                            '/auth/login?next=/auth/change-password'
                                        );
                                    }

                                    const err = await res.json();
                                    throw new Error(err.message);
                                })
                                .then((res) => {
                                    toast({
                                        title: res.message,
                                        status: 'success',
                                        isClosable: true
                                    });
                                    console.log(res);
                                })
                                .catch((err) => {
                                    toast({
                                        title: err.message,
                                        status: 'error',
                                        isClosable: true
                                    });
                                    console.error(err.message);
                                    setButtonText('Password Change Failed');
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
                                        Verification code
                                        <Text color={brandStars}>*</Text>
                                    </FormLabel>
                                    <InputGroup size="md">
                                        <Field
                                            as={Input}
                                            isRequired={true}
                                            value={code}
                                            fontSize="sm"
                                            mb="2px"
                                            size="md"
                                            variant="auth"
                                            disabled
                                        />
                                    </InputGroup>
                                </FormControl>

                                <FormControl
                                    mb="4px"
                                    isInvalid={
                                        !!errors.description &&
                                        touched.description
                                    }
                                >
                                    <FormLabel
                                        ms="4px"
                                        fontSize="sm"
                                        fontWeight="500"
                                        color={textColor}
                                        display="flex"
                                    >
                                        New password
                                        <Text color={brandStars}>*</Text>
                                    </FormLabel>
                                    <InputGroup size="md">
                                        <Field
                                            as={Input}
                                            isRequired={true}
                                            id="password"
                                            name="password"
                                            type={show ? 'text' : 'password'}
                                            fontSize="sm"
                                            mb="2px"
                                            size="md"
                                            variant="auth"
                                            validate={(value) => {
                                                let error;
                                                if (value.length == 0) {
                                                    error =
                                                        "Password can't be empty";
                                                }
                                                return error;
                                            }}
                                        />
                                        <InputRightElement
                                            onClick={setShow.toggle}
                                        >
                                            <RiEyeFill />
                                        </InputRightElement>
                                    </InputGroup>
                                </FormControl>

                                <FormControl>
                                    <Button
                                        fontSize="sm"
                                        variant="brand"
                                        fontWeight="500"
                                        w="55%"
                                        h="37"
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

export default ChangePassword;
