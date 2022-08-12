import { Button, Flex, FormControl, FormLabel, Switch } from '@chakra-ui/react';
import { Formik, Field } from 'formik';
import React from 'react';

function VisibilityForm({ onSubmit }) {
  return (
    <Formik
      onSubmit={onSubmit}
      initialValues={{
        trending: false,
        guestCheckout: false,
        private_product: false,
        marketPlace: false
      }}
    >
      {({ handleSubmit, errors, touched, values }) => (
        <form>
          <Flex direction="column">
            <FormControl
              mt="24px"
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <FormLabel htmlFor="trending" name="trending">
                Trending
              </FormLabel>
              <Field
                as={Switch}
                id="trending"
                name="trending"
                variant="auth"
                fontSize="sm"
                mb="3px"
                fontWeight="500"
                size="md"
              />
            </FormControl>

            <FormControl
              mt="12px"
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <FormLabel htmlFor="guestCheckout" name="guestCheckout">
                Guest Checkout
              </FormLabel>
              <Field
                as={Switch}
                id="guestCheckout"
                name="guestCheckout"
                variant="auth"
                fontSize="sm"
                mb="3px"
                fontWeight="500"
                size="md"
              />
            </FormControl>

            <FormControl
              mt="12px"
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <FormLabel htmlFor="private_product" name="private_product">
                Private Product
              </FormLabel>
              <Field
                as={Switch}
                id="private_product"
                name="private_product"
                variant="auth"
                fontSize="sm"
                mb="3px"
                fontWeight="500"
                size="md"
              />
            </FormControl>

            <FormControl
              mt="12px"
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <FormLabel htmlFor="marketPlace" name="marketPlace">
                Market Place
              </FormLabel>
              <Field
                as={Switch}
                id="marketPlace"
                name="marketPlace"
                variant="auth"
                fontSize="sm"
                mb="3px"
                fontWeight="500"
                size="md"
              />
            </FormControl>
            <Button
              maxW="max-content"
              ml="auto"
              mr="0"
              mt="24px"
              mb="8px"
              colorScheme="blue"
              onClick={handleSubmit}
            >
              Next
            </Button>
          </Flex>
        </form>
      )}
    </Formik>
  );
}

export default VisibilityForm;
