import React from 'react';

import {
  Button,
  Flex,
  Text,
  useColorModeValue,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Progress,
  useDisclosure,
  useToast
} from '@chakra-ui/react';

import { useRouter } from 'next/router.js';
import { useEffect, useState, useRef } from 'react';

import Navbar from '../../../ui/components/Navbar';
import BasicForm from '../../../ui/components/product_form/basic';
import VisibilityForm from '../../../ui/components/product_form/visibility';
import CategoriesForm from '../../../ui/components/product_form/categories';
import VariantsForm from '../../../ui/components/product_form/variants';
import ShippingForm from '../../../ui/components/product_form/shipping';
import ResellingForm from '../../../ui/components/product_form/reselling';
import { CheckIcon } from '@chakra-ui/icons';

function CreateProduct() {
  const [formValues, setFormValues] = useState({});
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const router = useRouter();

  const [accordionState, setAccordionState] = useState({
    basic: true,
    visibility: true,
    categories: true,
    variants: true,
    shipping: true,
    reselling: true
  });
  const [accordionFilledState, setAccordionFilledState] = useState({
    basic: false,
    visibility: false,
    categories: false,
    variants: false,
    shipping: false,
    reselling: false
  });

  const [stripe, setStripe] = useState(true);
  const [colors, setColor] = useState('twitter');
  const [anim, setAnim] = useState(true);
  const [modalContext, setModalContext] = useState('');

  const [accordionIndex, setAccordionIndex] = useState(0);

  const textColor = useColorModeValue('navy.700', 'white');
  const bgColor = useColorModeValue('white', 'navy.800');

  useEffect(() => {
    if (!sessionStorage.token_admin)
      router.push(`/auth/admin/login?next=${router.pathname}`);
  });

  function createProduct() {
    console.log(formValues);
    const { skus, price, discountedPrice, featuredFrom, featuredTo, ...body } =
      formValues;

    body.featuredFrom = new Date(featuredFrom).toISOString();
    body.featuredTo = new Date(featuredTo).toISOString();

    fetch('/api/products/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${sessionStorage.token_admin}`
      },
      body: JSON.stringify(body)
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }

        if (res.status == 401 || res.status == 403) {
          router.push(`/auth/admin/login?next=${router.pathname}`);
          throw new Error(
            JSON.stringify({
              message: 'Unauthorized Admin'
            })
          );
        }

        const err = res.json();

        throw new Error(
          JSON.stringify({
            message: err.message
          })
        );
      })
      .then((res) => {
        toast({
          title: res.message,
          status: 'success',
          isClosable: true
        });

        setModalContext('Creating SKUs');
        onOpen();

        const body = [];

        skus.forEach((row) => {
          const sku = {};
          const {
            price,
            discountedPrice,
            quantity,
            featureImage,
            gallery,
            ...attributes
          } = row;

          sku.slug = res.product.slug;
          sku.attributes = attributes;
          sku.quantity = quantity;
          sku.price = price;
          sku.discountedPrice = discountedPrice;
          sku.productId = res.product.id;
          sku.supplierId = res.product.supplierId;
          sku.published = false;
          sku.categoryIds = res.product.categoryIds;
          sku.featureImage = featureImage;
          sku.gallery = gallery;

          body.push(sku);
        });

        fetch('/api/sku/bulk-create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${sessionStorage.token_admin}`
          },
          body: JSON.stringify({ body })
        })
          .then((res) => {
            if (res.ok) {
              return res.json();
            }

            const err = res.json();

            if (res.status == 401 || res.status == 403) {
              router.push(`/auth/admin/login?next=${router.pathname}`);
              throw new Error(
                JSON.stringify({
                  message: 'Unauthorized Admin'
                })
              );
            }

            throw new Error(
              JSON.stringify({
                message: err.message
              })
            );
          })
          .then((res) => {
            toast({
              title: res.message,
              status: 'success',
              isClosable: true
            });

            setStripe(false);
            setColor('whatsapp');
            setAnim(false);
          })
          .catch((err) => {
            toast({
              title: err.message,
              status: 'error',
              isClosable: true
            });

            console.error(err.message);
          });
      })
      .catch((err) => {
        toast({
          title: err.message,
          status: 'error',
          isClosable: true
        });

        console.error(err.message);
      });
  }

  return (
    <>
      <Navbar heading="Create your products" size="full" />
      <Flex
        maxW={{ base: '100%', md: 'max-content' }}
        w="100%"
        h="100%"
        alignItems="start"
        justifyContent="center"
        px={{ base: '25px', md: '30px' }}
        pt="100px"
        flexDirection="column"
        color={textColor}
      >
        <Flex bgColor={bgColor} p="24px" mt="24px" borderRadius="16px">
          <Accordion
            allowToggle
            onChange={(index) => setAccordionIndex(index)}
            w="1024px"
            defaultIndex={0}
            index={accordionIndex}
          >
            <AccordionItem>
              <AccordionButton
                _expanded={{ fontWeight: 700 }}
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Flex alignItems="center" gap="8px">
                  {accordionFilledState.basic && (
                    <CheckIcon
                      color="white"
                      bgColor="green.300"
                      boxSize="28px"
                      p="6px"
                      borderRadius="full"
                    />
                  )}
                  <Text fontSize="20px">Basic Details</Text>
                </Flex>
                <AccordionIcon />
              </AccordionButton>

              <AccordionPanel mt="12px">
                <BasicForm
                  token={
                    typeof window !== 'undefined'
                      ? sessionStorage.token_admin
                      : ''
                  }
                  onSubmit={(values) => {
                    setAccordionState((prev) => ({
                      ...prev,
                      visibility: false
                    }));
                    setAccordionFilledState((prev) => ({
                      ...prev,
                      basic: true
                    }));
                    setAccordionIndex(1);
                    setFormValues((prev) => ({ ...prev, ...values }));
                  }}
                />
              </AccordionPanel>
            </AccordionItem>

            <AccordionItem isDisabled={accordionState.visibility}>
              <AccordionButton
                _expanded={{ fontWeight: 700 }}
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Flex alignItems="center" gap="8px">
                  {accordionFilledState.visibility && (
                    <CheckIcon
                      color="white"
                      bgColor="green.300"
                      boxSize="28px"
                      p="6px"
                      borderRadius="full"
                    />
                  )}
                  <Text fontSize="20px">Visibility</Text>
                </Flex>
                <AccordionIcon />
              </AccordionButton>

              <AccordionPanel mt="12px">
                <VisibilityForm
                  onSubmit={(values) => {
                    setAccordionState((prev) => ({
                      ...prev,
                      categories: false
                    }));
                    setAccordionFilledState((prev) => ({
                      ...prev,
                      visibility: true
                    }));
                    setAccordionIndex(2);
                    setFormValues((prev) => ({ ...prev, ...values }));
                    console.log(values);
                  }}
                />
              </AccordionPanel>
            </AccordionItem>

            <AccordionItem isDisabled={accordionState.categories}>
              <AccordionButton
                _expanded={{ fontWeight: 700 }}
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Flex alignItems="center" gap="8px">
                  {accordionFilledState.categories && (
                    <CheckIcon
                      color="white"
                      bgColor="green.300"
                      boxSize="28px"
                      p="6px"
                      borderRadius="full"
                    />
                  )}
                  <Text fontSize="20px">Categories</Text>
                </Flex>
                <AccordionIcon />
              </AccordionButton>

              <AccordionPanel mt="12px">
                <CategoriesForm
                  onSubmit={(value) => {
                    console.log(value);
                    setFormValues((prev) => ({
                      ...prev,
                      categoryIds: [value]
                    }));
                    setAccordionState((prev) => ({ ...prev, variants: false }));
                    setAccordionFilledState((prev) => ({
                      ...prev,
                      categories: true
                    }));
                    setAccordionIndex(3);
                  }}
                  token={
                    typeof window !== 'undefined'
                      ? sessionStorage.token_admin
                      : ''
                  }
                />
              </AccordionPanel>
            </AccordionItem>

            <AccordionItem isDisabled={accordionState.variants}>
              <AccordionButton
                _expanded={{ fontWeight: 700 }}
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Flex alignItems="center" gap="8px">
                  {accordionFilledState.variants && (
                    <CheckIcon
                      color="white"
                      bgColor="green.300"
                      boxSize="28px"
                      p="6px"
                      borderRadius="full"
                    />
                  )}
                  <Text fontSize="20px">Variants</Text>
                </Flex>
                <AccordionIcon />
              </AccordionButton>

              <AccordionPanel mt="12px">
                <VariantsForm
                  onSubmit={({ variants, skus }) => {
                    console.log(variants, skus);
                    setFormValues((prev) => ({
                      ...prev,
                      attributes: variants,
                      skus
                    }));
                    setAccordionState((prev) => ({ ...prev, shipping: false }));
                    setAccordionFilledState((prev) => ({
                      ...prev,
                      variants: true
                    }));
                    setAccordionIndex(4);
                  }}
                  values={formValues}
                />
              </AccordionPanel>
            </AccordionItem>

            <AccordionItem isDisabled={accordionState.shipping}>
              <AccordionButton
                _expanded={{ fontWeight: 700 }}
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Flex alignItems="center" gap="8px">
                  {accordionFilledState.shipping && (
                    <CheckIcon
                      color="white"
                      bgColor="green.300"
                      boxSize="28px"
                      p="6px"
                      borderRadius="full"
                    />
                  )}
                  <Text fontSize="20px">Shipping</Text>
                </Flex>
                <AccordionIcon />
              </AccordionButton>

              <AccordionPanel mt="12px">
                <ShippingForm
                  onSubmit={(values) => {
                    console.log(values);
                    setAccordionState((prev) => ({
                      ...prev,
                      reselling: false
                    }));
                    setAccordionFilledState((prev) => ({
                      ...prev,
                      shipping: true
                    }));
                    setAccordionIndex(5);
                  }}
                />
              </AccordionPanel>
            </AccordionItem>

            <AccordionItem isDisabled={accordionState.reselling}>
              <AccordionButton
                _expanded={{ fontWeight: 700 }}
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Flex alignItems="center" gap="8px">
                  {accordionFilledState.reselling && (
                    <CheckIcon
                      color="white"
                      bgColor="green.300"
                      boxSize="28px"
                      p="6px"
                      borderRadius="full"
                    />
                  )}
                  <Text fontSize="20px">Reselling and B2B</Text>
                </Flex>
                <AccordionIcon />
              </AccordionButton>

              <AccordionPanel mt="12px">
                <ResellingForm
                  onSubmit={(values) => {
                    setAccordionFilledState((prev) => ({
                      ...prev,
                      reselling: true
                    }));
                    setFormValues((prev) => ({
                      ...prev,
                      reseller: {
                        allowed: values.allowed
                      }
                    }));
                    if (values.allowed) {
                      setFormValues((prev) => {
                        const newObj = { ...prev };
                        newObj.reseller.type = values.type;
                        newObj.reseller[values.type] = values.value;

                        return newObj;
                      });
                    }
                    setAccordionIndex(-1);
                  }}
                />
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        </Flex>
        <Button
          disabled={
            !Object.values(accordionFilledState).every(
              (value) => value === true
            )
          }
          colorScheme="blue"
          mt="20px"
          mb="40px"
          ml="auto"
          mr="0"
          onClick={createProduct}
        >
          Submit
        </Button>
      </Flex>
      {isOpen && (
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>{modalContext}</ModalHeader>
            <ModalCloseButton />
            <ModalBody mb="17px">
              {modalContext == 'Creating SKUs' && (
                <>
                  <Progress
                    value={100}
                    minWidth="100%"
                    max={100}
                    isIndeterminate={stripe}
                    colorScheme={colors}
                    hasStripe={stripe}
                    isAnimated={anim}
                    mb="23px"
                  />
                  {formValues.skus.length} SKUs Created
                </>
              )}
            </ModalBody>
          </ModalContent>
        </Modal>
      )}
    </>
  );
}

export default CreateProduct;
