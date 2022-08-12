import {
    Button,
    Flex,
    Input,
    Select,
    Switch,
    Text,
    useColorModeValue,
    useToast
} from '@chakra-ui/react';
import React, { useState } from 'react';

function ResellingForm({ onSubmit }) {
    const toast = useToast();
    const [reseller, setReseller] = useState({
        allowed: false,
        type: '',
        value: 0
    });

    const textColor = useColorModeValue('navy.700', 'white');

    return (
        <Flex direction="column">
            <Flex alignContent="center">
                <Text fontWeight="700" color={textColor} display="flex">
                    Allowed?
                </Text>
                <Switch
                    mt="4px"
                    ml="24px"
                    id="reseller_allowed"
                    name="reseller_allowed"
                    checked={reseller.allowed}
                    onChange={(e) =>
                        setReseller((reseller) => {
                            const { allowed, ...rest } = reseller;
                            return {
                                allowed: !allowed,
                                ...rest
                            };
                        })
                    }
                />
            </Flex>
            {reseller.allowed && (
                <Flex gap="12px" my="8px" maxW="600px">
                    <Select
                        id="reseller_type"
                        name="reseller_type"
                        minW="300px"
                        placeholder="Select reseller type"
                        onChange={(e) =>
                            setReseller((prev) => {
                                prev.type = e.target.selectedOptions[0].value;
                                return prev;
                            })
                        }
                    >
                        <option value="commission">Commission</option>
                        <option value="discount">Discount</option>
                    </Select>
                    <Input
                        w="200px"
                        type="number"
                        id="reseller_type_value"
                        name="reseller_type_value"
                        placeholder="0"
                        value={reseller.value}
                        onChange={(e) =>
                            setReseller((prev) => ({
                                ...prev,
                                value:
                                    parseInt(e.target.value).toString() ===
                                    'NaN'
                                        ? 0
                                        : parseInt(e.target.value)
                            }))
                        }
                    />
                </Flex>
            )}
            <Button
                maxW="max-content"
                ml="auto"
                mr="0"
                mt="24px"
                mb="8px"
                colorScheme="blue"
                onClick={() => {
                    if (
                        reseller.allowed &&
                        (!reseller.type || !reseller.value)
                    ) {
                        toast({
                            title: 'Reseller type or value not provided',
                            status: 'error',
                            isClosable: true
                        });
                    } else onSubmit(reseller);
                }}
            >
                Next
            </Button>
        </Flex>
    );
}

export default ResellingForm;
