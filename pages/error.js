import React from 'react';

// Assets
import { useRouter } from 'next/router.js';
import { WarningIcon } from '@chakra-ui/icons';
import { Button, Flex, Text } from '@chakra-ui/react';

function Error() {
    const router = useRouter();

    return (
        <Flex
            maxW="700px"
            alignItems="center"
            gap="24px"
            rounded="2xl"
            mt="20px"
            mx="auto"
            p="20px"
            pt="25vh"
        >
            <WarningIcon color="yellow.300" boxSize="200px" />
            <Flex direction="column">
                <Text fontSize="32px" fontWeight="700">
                    {router.query.message}
                </Text>
                {router.query.message == 'Email verification pending' && (
                    <Button
                        colorScheme="blue"
                        w="fit-content"
                        mt="24px"
                        onClick={() => {
                            fetch('/api/user/resend-verification-link', {
                                method: 'GET',
                                headers: {
                                    Authorization: `Bearer ${sessionStorage.userToken}`
                                }
                            });
                        }}
                    >
                        Resend verification Link
                    </Button>
                )}
            </Flex>
        </Flex>
    );
}

export default Error;
