import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import {
    Button,
    Flex,
    Heading,
    Text,
    useColorModeValue
} from '@chakra-ui/react';
import Link from 'next/link';

export default function Verify() {
    const [message, setMessage] = useState('');
    const [success, setSuccess] = useState(false);
    const router = useRouter();
    const { code } = router.query;
    const textColor = useColorModeValue('navy.700', 'white');
    const textColorSecondary = 'gray.400';

    useEffect(() => {
        setMessage('Verifying...');

        if (code)
            fetch(`/api/user/verify?code=${code}`)
                .then((res) => res.json())
                .then((res) => {
                    if (res.verifiedUser.email_verified) {
                        setMessage(
                            'Verification successful! You can close this window now.'
                        );
                        setSuccess(true);
                    } else setMessage('Verification failed! Please retry...');
                })
                .catch((err) => {
                    console.log(err);
                    setMessage('Some error has occured...');
                });
    }, [code]);

    return (
        <div>
            <Flex
                maxW={{ base: '100%', md: 'max-content' }}
                w="100%"
                mx={{ base: 'auto', lg: '0px' }}
                me="auto"
                h="100%"
                alignItems="start"
                justifyContent="center"
                mb={{ base: '30px', md: '60px' }}
                px={{ base: '25px', md: '150px' }}
                mt={{ base: '40px', md: '20vh' }}
                flexDirection="column"
            >
                <Heading color={textColor} fontSize="34px" mb="2px">
                    Email verification
                </Heading>
                <Text
                    mb="10px"
                    ms="4px"
                    color={textColorSecondary}
                    fontWeight="400"
                    fontSize="md"
                >
                    {message}
                </Text>
                {success && (
                    <Button
                        fontSize="sm"
                        variant="brand"
                        fontWeight="500"
                        w="55%"
                        h="37"
                        mb="8px"
                        mt="13px"
                    >
                        <Link href="/">
                            <a>Go to home</a>
                        </Link>
                    </Button>
                )}
            </Flex>
        </div>
    );
}
