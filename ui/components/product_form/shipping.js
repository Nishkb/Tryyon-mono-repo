import { Button, Flex } from '@chakra-ui/react';
import React from 'react';

function ShippingForm({ onSubmit }) {
  return (
    <Flex direction="column">
      ShippingForm
      <Button
        maxW="max-content"
        ml="auto"
        mr="0"
        mt="24px"
        mb="8px"
        colorScheme="blue"
        onClick={onSubmit}
      >
        Next
      </Button>
    </Flex>
  );
}

export default ShippingForm;
