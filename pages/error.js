import React from 'react';

// Assets
import { useRouter } from 'next/router.js';
import { WarningIcon } from '@chakra-ui/icons';
import { Flex, Text } from '@chakra-ui/react';

function Error() {
    const router = useRouter();

    return (
        <Flex
            bgColor="red.100"
            maxW="700px"
            color="red"
            alignItems="center"
            gap="24px"
            rounded="2xl"
            border="2px solid red"
            mt="20px"
            mx="auto"
            p="20px"
        >
            <WarningIcon boxSize="200px" />
            <Text fontSize="32px" fontWeight="700">
                {router.query.message}
            </Text>
        </Flex>
    );
}

export default Error;
