import React from 'react';

import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Heading,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Input,
  Text,
  useColorModeValue,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Checkbox,
  useDisclosure,
  Progress,
  useToast,
  Switch,
  Select,
  RadioGroup,
  Radio,
  CheckboxGroup,
  IconButton,
  Tag,
  TagCloseButton,
  HStack,
  TagLabel
} from '@chakra-ui/react';

import { useRouter } from 'next/router.js';
import { useEffect, useState, useRef } from 'react';

import { Formik, Field } from 'formik';
import { AddIcon, ChevronDownIcon } from '@chakra-ui/icons';
import CustomEditable from '../../../ui/components/CustomEditable';
import { HSeparator } from '../../../ui/components/separator/Separator';
import TableComp from '../../../ui/components/table';

function CreateProduct() {
  // Chakra color mode
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [supplier, setSupplier] = useState('');
  const [supplierName, setSupplierName] = useState('Select Supplier');

  const [categories, setCategories] = useState({ root: [] });
  const [cat, setCat] = useState(['root']);
  const [modalContext, setModalContext] = useState('');

  //For Progress bar
  const [stripe, setStripe] = useState(true);
  const [colors, setColor] = useState('twitter');
  const [anim, setAnim] = useState(true);
  const [tenants, setTenants] = useState([]);

  const [locations, setLocations] = useState([]);

  const textColor = useColorModeValue('navy.700', 'white');
  const brandStars = useColorModeValue('brand.500', 'brand.400');

  const [variants, setVariants] = useState({});
  const [availableVariants, setAvailableVariants] = useState({
    Size: ['small', 'medium', 'large'],
    Colour: ['red', 'blue', 'green']
  });

  const [availableLocations, setAvailableLocations] = useState([]);
  const [editModalSKUIndex, setEditModalSKUIndex] = useState(0);
  const [images, setImages] = useState([]);

  const [colData, setColData] = useState([
    {
      Header: 'QUANTITY',
      accessor: 'quantity'
    },
    {
      Header: 'PRICE',
      accessor: 'price'
    },
    {
      Header: 'DISCOUNTED PRICE',
      accessor: 'discountedPrice'
    }
  ]);

  const [tableData, setTableData] = useState([]);

  const [skus, setSKUs] = useState(0);

  const router = useRouter();
  const toast = useToast();

  const [reseller, setReseller] = useState({
    allowed: false,
    type: '',
    value: 0
  });

  const [imgTags, setImgTags] = useState([]);

  const imageInputRef = useRef();

  useEffect(() => {
    if (!sessionStorage.token_admin)
      router.push(`/auth/admin/login?next=${router.pathname}`);
  });

  useEffect(() => {
    fetch('/api/tenant/', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${sessionStorage.token_admin}`
      }
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }

        if (res.status == 401 || res.status == 403) {
          router.push(`/auth/admin/login?next=${router.pathname}`);

          throw new Error(
            JSON.stringify({
              message: 'Uauthorised Admin'
            })
          );
        } else {
          const err = res.json();

          throw new Error(
            JSON.stringify({
              message: err.message
            })
          );
        }
      })
      .then((res) => {
        setTenants(res.tenants);
      })
      .catch((err) => {
        console.error(err.message);
        toast({
          title: err.message,
          status: 'error',
          isClosable: true
        });
      });

    fetch('/api/products/category?isRoot=true', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${sessionStorage.token_admin}`
      }
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }

        if (res.status == 401 || res.status == 403) {
          router.push(`/auth/admin/login?next=${router.pathname}`);

          throw new Error(
            JSON.stringify({
              message: 'Uauthorised Admin'
            })
          );
        } else {
          const err = res.json();

          throw new Error(
            JSON.stringify({
              message: err.message
            })
          );
        }
      })
      .then((res) => {
        setCategories((prev) => {
          prev.root = res.categories;
          return prev;
        });
      })
      .catch((err) => {
        console.error(err.message);
        toast({
          title: err.message,
          status: 'error',
          isClosable: true
        });
      });

    fetch('/api/location/', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${sessionStorage.token_admin}`
      }
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }

        if (res.status == 401 || res.status == 403) {
          router.push(`/auth/admin/login?next=${router.pathname}`);

          throw new Error(
            JSON.stringify({
              message: 'Uauthorised Admin'
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
        setAvailableLocations(res.locations);
      })
      .catch((err) => {
        console.error(err.message);
        toast({
          title: err.message,
          status: 'error',
          isClosable: true
        });
      });
  }, [toast, router]);

  //function to generate permutations of all possible entries dynamically
  function permute(input) {
    let out = [];

    (function permute_r(input, current) {
      if (input.length === 0) {
        out.push(current);
        return;
      }
      var next = input.slice(1);
      for (var i = 0, n = input[0].length; i != n; ++i) {
        permute_r(next, current.concat([input[0][i]]));
      }
    })(input, []);
    return out;
  }

  function updateTable(quantity, price, discountedPrice) {
    const newCol = [],
      perm = [],
      newTableData = [];

    const variantKeys = Object.keys(variants);

    variantKeys.forEach((e) => {
      newCol.push({
        Header: e.toUpperCase(),
        accessor: e
      });

      perm.push(variants[e]);
    });

    newCol.push({
      Header: 'QUANTITY',
      accessor: 'quantity'
    });

    newCol.push({
      Header: 'PRICE',
      accessor: 'price'
    });

    newCol.push({
      Header: 'DISCOUNTED PRICE',
      accessor: 'discountedPrice'
    });

    const permuted = permute(perm);
    const q = Math.floor(quantity / permuted.length);

    for (let i = 0; i < permuted.length; i++) {
      newTableData.push({});
      for (let j = 0; j < variantKeys.length; j++) {
        newTableData[i][variantKeys[j]] = permuted[i][j];
      }
      newTableData[i]['quantity'] = q;
      newTableData[i]['price'] = price;
      newTableData[i]['discountedPrice'] = discountedPrice;
    }

    setColData(newCol);
    setTableData(newTableData);
  }

  function getChildrenCategories(id_c, index) {
    if (!categories[id_c]) {
      fetch(`/api/products/category?id=${id_c}&includeChildren=true`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${sessionStorage.token_admin}`
        }
      })
        .then((res) => {
          if (res.ok) {
            return res.json();
          }

          if (res.status == 401 || res.status == 403) {
            router.push(`/auth/admin/login?next=${router.pathname}`);

            throw new Error(
              JSON.stringify({
                message: 'Uauthorised Admin'
              })
            );
          } else {
            const err = res.json();

            throw new Error(
              JSON.stringify({
                message: err.message
              })
            );
          }
        })
        .then((res) => {
          if (
            res.categories[0].children &&
            res.categories[0].children.length != 0
          ) {
            setCategories((prev) => {
              const newObj = { ...prev };

              newObj[id_c] = res.categories[0].children;
              return newObj;
            });
          }

          setCat((prev) => {
            let newArr = [...prev];

            if (index < newArr.length) newArr = newArr.slice(0, index + 1);
            newArr.push(id_c);

            return newArr;
          });
        })
        .catch((err) => {
          console.error(err.message);
          toast({
            title: err.message,
            status: 'error',
            isClosable: true
          });
        });
    } else {
      setCat((prev) => {
        if (index < prev.length) prev = prev.slice(0, index + 1);
        prev.push(id_c);
        return prev;
      });
    }
  }

  return (
    <>
      <Flex
        maxW={{ base: '100%', md: 'max-content' }}
        w="100%"
        h="100%"
        alignItems="start"
        justifyContent="center"
        px={{ base: '25px', md: '30px' }}
        mt="5px"
        flexDirection="column"
      >
        <Box me="auto">
          <Heading color={textColor} fontSize="34px" mb="16px">
            Create your products
          </Heading>
        </Box>
        <Flex
          zIndex="2"
          direction="column"
          maxW="100%"
          background="transparent"
          borderRadius="15px"
          mx={{ base: 'auto', lg: 'unset' }}
          me="auto"
          mb={{ base: '30px', md: 'auto' }}
        >
          <Formik
            initialValues={{
              name: '',
              description: '',
              shortDescriptions: '',
              quantity: 0,
              price: 0,
              discountedPrice: 0,
              slug: '',
              manufacturer: '',
              countryOfOrigin: '',
              featuredFrom: '',
              featuredTo: '',
              trending: false,
              guestCheckout: false,
              private_product: false,
              marketPlace: false
            }}
            onSubmit={async (values) => {
              if (tableData.length == 0) {
                toast({
                  title: 'SKUs not generated',
                  status: 'error',
                  isClosable: true
                });
                throw new Error('SKUs not generated');
              }

              let totalSKUQuantity = 0;
              tableData.forEach((row) => {
                totalSKUQuantity += row.quantity;
              });

              if (totalSKUQuantity != values.quantity) {
                let details = '',
                  title = '';

                if (totalSKUQuantity > values.quantity) {
                  details =
                    'Total SKU quantity not equal to the product quantity. Decrease the quantity for some SKUs or increase the product quantity.';
                  title = `Excess SKU quantity: ${Math.abs(
                    totalSKUQuantity - values.quantity
                  )}`;
                } else {
                  details =
                    'Total SKU quantity not equal to the product quantity. Increase the quantity for some SKUs or decrease the product quantity.';
                  title = `Excess product quantity: ${Math.abs(
                    totalSKUQuantity - values.quantity
                  )}`;
                }

                toast({
                  title: title,
                  description: details,
                  status: 'error',
                  isClosable: true
                });
                throw new Error(`${title} ${details}`);
              }

              const { price, discountedPrice, ...body } = values;

              if (supplier == '') {
                toast({
                  title: 'Reseller Type not selected',
                  status: 'error',
                  isClosable: true
                });

                throw new Error(
                  JSON.stringify({
                    message: 'Reseller type not selected'
                  })
                );
              } else body.supplierId = supplier;

              if (images.length == 0) {
                toast({
                  title: 'No image provided',
                  status: 'error',
                  isClosable: true
                });

                throw new Error(
                  JSON.stringify({
                    message: 'No image provided'
                  })
                );
              }

              const categoryId = cat[cat.length - 1];

              if (!categoryId || categoryId == 'root') {
                toast({
                  title: 'Category not selected',
                  status: 'error',
                  isClosable: true
                });

                throw new Error(
                  JSON.stringify({
                    message: 'Category not selected'
                  })
                );
              } else body.categoryIds = [categoryId];

              if (locations.length == 0) {
                toast({
                  title: 'Locations not selected',
                  status: 'error',
                  isClosable: true
                });

                throw new Error(
                  JSON.stringify({
                    message: 'Locations not selected'
                  })
                );
              } else body.locationIds = locations;

              body.reseller = { allowed: reseller.allowed };

              if (reseller.allowed) {
                if (
                  reseller.type !== 'commission' &&
                  reseller.type !== 'discount'
                ) {
                  toast({
                    title: 'Reseller Type not selected',
                    status: 'error',
                    isClosable: true
                  });

                  throw new Error(
                    JSON.stringify({
                      message: 'Reseller type not selected'
                    })
                  );
                }

                body.reseller.type = reseller.type;
                body.reseller[reseller.type] = reseller.value;
              }

              body.attributes = { ...variants };
              body.featuredFrom = new Date(values.featuredFrom).toISOString();
              body.featuredTo = new Date(values.featuredTo).toISOString();

              console.log(body);

              let imageData = new FormData();

              for (let i = 0; i < images.length; i++) {
                imageData.append('image', images[i]);
              }

              console.log(imageData.get('image'));
              console.log(images);

              fetch('/api/upload', {
                method: 'POST',
                headers: {
                  Authorization: `Bearer ${sessionStorage.token_admin}`
                },
                body: imageData
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
                  body.images = res.body.map((img) => img.location);
                  console.log(body);
                })
                .then(() => {
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
                        router.push(
                          `/auth/admin/login?next=${router.pathname}`
                        );
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

                      tableData.forEach((row) => {
                        const sku = {};
                        const {
                          price,
                          discountedPrice,
                          quantity,
                          ...attributes
                        } = row;

                        sku.slug = values.slug;
                        sku.attributes = attributes;
                        sku.quantity = quantity;
                        sku.price = price;
                        sku.discountedPrice = discountedPrice;
                        sku.productId = res.product.id;
                        sku.supplierId = res.product.supplierId;
                        sku.published = false;
                        sku.categoryIds = res.product.categoryIds;

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
                            router.push(
                              `/auth/admin/login?next=${router.pathname}`
                            );
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
                          setSKUs(tableData.length);
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
                })
                .catch((err) => {
                  toast({
                    title: err.message,
                    status: 'error',
                    isClosable: true
                  });

                  console.error(err.message);
                });
            }}
          >
            {({ handleSubmit, errors, touched, values }) => (
              <form>
                <Flex w={{ base: '100%', md: '420px' }}>
                  <Flex
                    bgColor="white"
                    borderRadius="2xl"
                    p="32px"
                    h="max-content"
                    direction="column"
                  >
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
                        Name<Text color={brandStars}>*</Text>
                      </FormLabel>
                      <Field
                        as={Input}
                        isRequired={true}
                        id="name"
                        name="name"
                        variant="auth"
                        fontSize="sm"
                        mb="3px"
                        fontWeight="500"
                        size="md"
                        validate={(value) => {
                          let error;
                          if (value.length === 0) {
                            error = 'Field can not be empty';
                          }
                          return error;
                        }}
                      />
                      <FormErrorMessage>{errors.name}</FormErrorMessage>
                    </FormControl>

                    <FormControl
                      mb="4px"
                      isInvalid={!!errors.description && touched.description}
                    >
                      <FormLabel
                        ms="4px"
                        fontSize="sm"
                        fontWeight="500"
                        color={textColor}
                        display="flex"
                      >
                        Description<Text color={brandStars}>*</Text>
                      </FormLabel>
                      <Field
                        as={Input}
                        isRequired={true}
                        id="description"
                        name="description"
                        variant="auth"
                        fontSize="sm"
                        mb="3px"
                        fontWeight="500"
                        size="md"
                        validate={(value) => {
                          let error;
                          if (value.length === 0) {
                            error = 'Field can not be empty';
                          }
                          return error;
                        }}
                      />
                      <FormErrorMessage>{errors.description}</FormErrorMessage>
                    </FormControl>

                    <FormControl
                      mb="4px"
                      isInvalid={
                        !!errors.shortDescriptions && touched.shortDescriptions
                      }
                    >
                      <FormLabel
                        ms="4px"
                        fontSize="sm"
                        fontWeight="500"
                        color={textColor}
                        display="flex"
                      >
                        Short Description<Text color={brandStars}>*</Text>
                      </FormLabel>
                      <Field
                        as={Input}
                        isRequired={true}
                        id="shortDescriptions"
                        name="shortDescriptions"
                        variant="auth"
                        fontSize="sm"
                        mb="3px"
                        fontWeight="500"
                        size="md"
                        validate={(value) => {
                          let error;
                          if (value.length === 0) {
                            error = 'Field can not be empty';
                            return error;
                          }
                          if (value.length >= values.description.length) {
                            error =
                              'It should be less than the main description';
                          }
                          return error;
                        }}
                      />
                      <FormErrorMessage>
                        {errors.shortDescriptions}
                      </FormErrorMessage>
                      {/* </InputGroup> */}
                    </FormControl>

                    <FormControl
                      mb="4px"
                      isInvalid={!!errors.slug && touched.slug}
                    >
                      <FormLabel
                        ms="4px"
                        fontSize="sm"
                        fontWeight="500"
                        color={textColor}
                        display="flex"
                      >
                        Slug<Text color={brandStars}>*</Text>
                      </FormLabel>
                      <Field
                        as={Input}
                        isRequired={true}
                        id="slug"
                        name="slug"
                        variant="auth"
                        fontSize="sm"
                        mb="3px"
                        fontWeight="500"
                        size="md"
                        validate={(value) => {
                          let error;
                          if (value.length === 0) {
                            error = 'Field can not be empty';
                          }
                          return error;
                        }}
                      />
                      <FormErrorMessage>{errors.slug}</FormErrorMessage>
                    </FormControl>

                    <FormControl
                      mb="4px"
                      isInvalid={!!errors.quantity && touched.quantity}
                    >
                      <FormLabel
                        display="flex"
                        ms="4px"
                        fontSize="sm"
                        fontWeight="500"
                        color={textColor}
                        mb="5px"
                      >
                        Quantity<Text color={brandStars}>*</Text>
                      </FormLabel>
                      <Field
                        as={Input}
                        isRequired={true}
                        id="quantity"
                        name="quantity"
                        type="number"
                        variant="auth"
                        fontSize="sm"
                        mb="3px"
                        fontWeight="500"
                        size="md"
                        validate={(value) => {
                          if (value == 0) {
                            return 'Field can not be empty';
                          }
                        }}
                      />
                      <FormErrorMessage>{errors.quantity}</FormErrorMessage>
                    </FormControl>

                    <FormControl
                      mb="4px"
                      isInvalid={!!errors.price && touched.price}
                    >
                      <FormLabel
                        display="flex"
                        ms="4px"
                        fontSize="sm"
                        fontWeight="500"
                        color={textColor}
                        mb="5px"
                      >
                        Price<Text color={brandStars}>*</Text>
                      </FormLabel>
                      <Field
                        as={Input}
                        isRequired={true}
                        id="price"
                        name="price"
                        variant="auth"
                        type="number"
                        fontSize="sm"
                        mb="3px"
                        fontWeight="500"
                        size="md"
                        validate={(value) => {
                          if (value == 0) {
                            return 'Field can not be empty';
                          }
                        }}
                      />
                      <FormErrorMessage>{errors.price}</FormErrorMessage>
                    </FormControl>

                    <FormControl
                      mb="4px"
                      isInvalid={
                        !!errors.discountedPrice && touched.discountedPrice
                      }
                    >
                      <FormLabel
                        display="flex"
                        ms="4px"
                        fontSize="sm"
                        fontWeight="500"
                        color={textColor}
                        mb="5px"
                      >
                        Discounted Price<Text color={brandStars}>*</Text>
                      </FormLabel>
                      <Field
                        as={Input}
                        isRequired={true}
                        id="discountedPrice"
                        name="discountedPrice"
                        variant="auth"
                        type="number"
                        fontSize="sm"
                        mb="3px"
                        fontWeight="500"
                        size="md"
                        validate={(value) => {
                          if (value == 0) {
                            return 'Field cannot be empty';
                          }
                          if (value > values.price) {
                            return 'Discounted price cannot be greater than price';
                          }
                        }}
                      />
                      <FormErrorMessage>
                        {errors.discountedPrice}
                      </FormErrorMessage>
                    </FormControl>

                    <FormControl
                      mb="4px"
                      isInvalid={!!errors.manufacturer && touched.manufacturer}
                    >
                      <FormLabel
                        ms="4px"
                        fontSize="sm"
                        fontWeight="500"
                        color={textColor}
                        display="flex"
                      >
                        Manufacturer<Text color={brandStars}>*</Text>
                      </FormLabel>
                      <Field
                        as={Input}
                        isRequired={true}
                        id="manufacturer"
                        name="manufacturer"
                        variant="auth"
                        fontSize="sm"
                        mb="3px"
                        fontWeight="500"
                        size="md"
                        validate={(value) => {
                          let error;
                          if (value.length === 0) {
                            error = 'Field can not be empty';
                          }
                          return error;
                        }}
                      />
                      <FormErrorMessage>{errors.manufacturer}</FormErrorMessage>
                    </FormControl>

                    <FormControl
                      mb="4px"
                      isInvalid={
                        !!errors.countryOfOrigin && touched.countryOfOrigin
                      }
                    >
                      <FormLabel
                        ms="4px"
                        fontSize="sm"
                        fontWeight="500"
                        color={textColor}
                        display="flex"
                      >
                        Country of Origin<Text color={brandStars}>*</Text>
                      </FormLabel>
                      <Field
                        as={Input}
                        isRequired={true}
                        id="countryOfOrigin"
                        name="countryOfOrigin"
                        variant="auth"
                        fontSize="sm"
                        mb="3px"
                        fontWeight="500"
                        size="md"
                        validate={(value) => {
                          let error;
                          if (value.length === 0) {
                            error = 'Field can not be empty';
                          }
                          return error;
                        }}
                      />
                      <FormErrorMessage>
                        {errors.countryOfOrigin}
                      </FormErrorMessage>
                    </FormControl>

                    <FormControl
                      mb="4px"
                      isInvalid={!!errors.featuredFrom && touched.featuredFrom}
                    >
                      <FormLabel
                        ms="4px"
                        fontSize="sm"
                        fontWeight="500"
                        color={textColor}
                        display="flex"
                      >
                        Featured From<Text color={brandStars}>*</Text>
                      </FormLabel>
                      <Field
                        as={Input}
                        type="datetime-local"
                        isRequired={true}
                        id="featuredFrom"
                        name="featuredFrom"
                        variant="auth"
                        fontSize="sm"
                        mb="3px"
                        fontWeight="500"
                        size="md"
                        validate={(value) => {
                          if (value == '') {
                            return 'Field can not be empty';
                          }
                        }}
                      />
                      <FormErrorMessage>{errors.featuredFrom}</FormErrorMessage>
                    </FormControl>

                    <FormControl
                      mb="4px"
                      isInvalid={!!errors.featuredTo && touched.featuredTo}
                    >
                      <FormLabel
                        ms="4px"
                        fontSize="sm"
                        fontWeight="500"
                        color={textColor}
                        display="flex"
                      >
                        Featured To<Text color={brandStars}>*</Text>
                      </FormLabel>
                      <Field
                        as={Input}
                        type="datetime-local"
                        isRequired={true}
                        id="featuredTo"
                        name="featuredTo"
                        variant="auth"
                        fontSize="sm"
                        mb="3px"
                        fontWeight="500"
                        size="md"
                        validate={(value) => {
                          if (value == '') {
                            return 'Field can not be empty';
                          }
                        }}
                      />
                      <FormErrorMessage>{errors.featuredTo}</FormErrorMessage>
                    </FormControl>
                    <FormLabel
                      ms="4px"
                      fontSize="sm"
                      fontWeight="500"
                      color={textColor}
                      display="flex"
                    >
                      Supplier<Text color={brandStars}>*</Text>
                    </FormLabel>
                    <Menu strategy="fixed">
                      <MenuButton
                        as={Button}
                        bgColor="transparent"
                        fontWeight="400"
                        minWidth="420px"
                        border="1px"
                        textAlign="left"
                        fontSize="md"
                        borderColor="blackAlpha.200"
                      >
                        {supplierName}
                        <ChevronDownIcon float="right" />
                      </MenuButton>
                      <MenuList>
                        {/* MenuItems are not rendered unless Menu is open */}
                        {tenants.map((obj, index) => (
                          <MenuItem
                            key={index}
                            onClick={() => {
                              setSupplier(obj.id);
                              setSupplierName(obj.name);
                            }}
                          >
                            {obj.name}
                          </MenuItem>
                        ))}
                      </MenuList>
                    </Menu>

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
                        isRequired={true}
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
                        isRequired={true}
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
                      <FormLabel
                        htmlFor="private_product"
                        name="private_product"
                      >
                        Private Product
                      </FormLabel>
                      <Field
                        as={Switch}
                        isRequired={true}
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
                        isRequired={true}
                        id="marketPlace"
                        name="marketPlace"
                        variant="auth"
                        fontSize="sm"
                        mb="3px"
                        fontWeight="500"
                        size="md"
                      />
                    </FormControl>
                  </Flex>
                  <Flex direction="column" ml="40px">
                    <Flex
                      bgColor="white"
                      borderRadius="2xl"
                      p="32px"
                      flexDirection="column"
                    >
                      <Text
                        fontSize="sm"
                        fontWeight="700"
                        color={textColor}
                        display="flex"
                      >
                        Select locations*
                      </Text>
                      <Flex>
                        <Flex direction="column">
                          {availableLocations.map((item, index) => {
                            return (
                              <Checkbox
                                key={index}
                                mt="10px"
                                w="max-content"
                                onChange={(e) => {
                                  if (e.target.checked === true) {
                                    setLocations((prev) => [
                                      ...prev,
                                      e.target.value
                                    ]);
                                  } else {
                                    setLocations((prev) => {
                                      prev.splice(
                                        prev.indexOf(e.target.value),
                                        1
                                      );
                                      return prev;
                                    });
                                  }
                                }}
                                value={item.id}
                              >
                                {item.name}
                              </Checkbox>
                            );
                          })}
                        </Flex>
                      </Flex>
                    </Flex>

                    <Flex
                      bgColor="white"
                      borderRadius="2xl"
                      p="32px"
                      mt="32px"
                      flexDirection="column"
                    >
                      <Text
                        fontSize="sm"
                        fontWeight="700"
                        color={textColor}
                        display="flex"
                      >
                        Select category*
                      </Text>
                      <Flex gap="16px">
                        {cat.map((val, index) => {
                          return (
                            <RadioGroup
                              key={index}
                              onChange={(value) => {
                                getChildrenCategories(value, index);
                              }}
                            >
                              <Flex direction="column">
                                {Array.isArray(categories[val]) &&
                                  categories[val].map((item, index) => {
                                    return (
                                      <Radio
                                        key={index}
                                        mt="10px"
                                        w="max-content"
                                        value={item.id}
                                      >
                                        {item.name}
                                      </Radio>
                                    );
                                  })}
                              </Flex>
                            </RadioGroup>
                          );
                        })}
                      </Flex>
                    </Flex>
                  </Flex>
                </Flex>

                <Flex
                  direction="column"
                  my="28px"
                  w={{ base: '100%', md: '420px' }}
                >
                  <Flex alignContent="center" justifyContent="space-between">
                    <Text
                      fontSize="2xl"
                      fontWeight="700"
                      color={textColor}
                      display="flex"
                    >
                      Reseller
                    </Text>
                    <Switch
                      mt="4px"
                      ml="16px"
                      id="reseller_allowed"
                      name="reseller_allowed"
                      checked={reseller.allowed}
                      onChange={(e) =>
                        setReseller((reseller) => {
                          const { allowed, ...rest } = reseller;
                          return { allowed: !allowed, ...rest };
                        })
                      }
                    />
                  </Flex>
                  {reseller.allowed && (
                    <Flex gap="12px" my="8px">
                      <Field
                        as={Select}
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
                      </Field>
                      <Field
                        as={Input}
                        type="number"
                        id="reseller_type_value"
                        name="reseller_type_value"
                        placeholder="0"
                        onChange={(e) =>
                          setReseller((prev) => {
                            prev.value = e.target.value;
                            return prev;
                          })
                        }
                      />
                    </Flex>
                  )}
                </Flex>

                <Flex
                  direction="column"
                  my="28px"
                  w={{ base: '100%', md: '420px' }}
                >
                  <Flex direction="column">
                    <Text
                      fontSize="2xl"
                      fontWeight="700"
                      color={textColor}
                      display="flex"
                    >
                      Images
                    </Text>
                    <Text
                      fontSize="sm"
                      fontWeight="400"
                      color={textColor}
                      display="flex"
                    >
                      Maximum 2MBs
                    </Text>
                    <HStack gap="8px" my="8px">
                      {imgTags}
                    </HStack>
                    <Button
                      w="max-content"
                      mt="8px"
                      colorScheme="blue"
                      onClick={() => {
                        imageInputRef.current.click();
                      }}
                    >
                      Select images
                    </Button>
                    <Input
                      ref={imageInputRef}
                      hidden
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={() => {
                        let flag = false;

                        for (
                          let i = 0;
                          i < imageInputRef.current.files.length;
                          i++
                        ) {
                          if (imageInputRef.current.files[i].size > 2097152) {
                            flag = true;
                            toast({
                              title: `File ${imageInputRef.current.files[i].name} is too large`,
                              status: 'error',
                              isClosable: true
                            });
                          }
                        }

                        if (!flag) {
                          setImages(imageInputRef.current.files);
                          let arr = [];

                          for (
                            let i = 0;
                            i < imageInputRef.current.files.length;
                            i++
                          ) {
                            arr.push(
                              <Tag
                                key={i}
                                colorScheme="blue"
                                variant="solid"
                                borderRadius="full"
                              >
                                <TagLabel>
                                  {imageInputRef.current.files[i].name}
                                </TagLabel>
                              </Tag>
                            );
                          }

                          setImgTags(arr);
                        }
                        console.log(images, Array.isArray(images));
                      }}
                    />
                  </Flex>
                </Flex>

                <Flex w="100%" mt="36px" flexDirection="column">
                  <Flex alignItems="center" gap="24px">
                    <Text
                      fontSize="2xl"
                      fontWeight="700"
                      color={textColor}
                      display="flex"
                    >
                      Variants
                    </Text>
                    {Object.keys(availableVariants).length < 5 && (
                      <IconButton
                        colorScheme="blue"
                        icon={<AddIcon />}
                        onClick={(e) => {
                          const v = prompt('Enter variant name');
                          setAvailableVariants((prev) => ({
                            ...prev,
                            [v]: []
                          }));
                        }}
                      />
                    )}
                  </Flex>
                  <Flex gap="16px" mt="8px">
                    {Object.keys(availableVariants).map((variant, index) => {
                      return (
                        <Flex
                          key={index}
                          direction="column"
                          minW="200px"
                          p="8px 16px"
                          bgColor="white"
                          borderRadius="xl"
                        >
                          <CustomEditable
                            py="4px"
                            fontWeight="700"
                            value={variant}
                            setValue={(value) => {
                              if (value != variant)
                                setAvailableVariants((prev) => {
                                  const newObj = { ...prev };

                                  Object.defineProperty(
                                    newObj,
                                    value,
                                    Object.getOwnPropertyDescriptor(
                                      newObj,
                                      variant
                                    )
                                  );
                                  delete newObj[variant];

                                  return newObj;
                                });
                            }}
                            deleteValue={() => {
                              setAvailableVariants((prev) => {
                                const newObj = { ...prev };

                                delete newObj[variant];
                                return newObj;
                              });

                              console.log(availableVariants);
                            }}
                          />
                          <HSeparator my="8px" />
                          <CheckboxGroup
                            onChange={(value) => {
                              setVariants((prev) => {
                                if (value.length == 0) {
                                  delete prev[variant];
                                  return prev;
                                }

                                prev[variant] = value;
                                return prev;
                              });
                            }}
                          >
                            {availableVariants[variant].map((val, idx) => {
                              return (
                                <Checkbox key={idx} value={val}>
                                  <CustomEditable
                                    py="4px"
                                    minW="200px"
                                    value={val}
                                    setValue={(value) => {
                                      setAvailableVariants((prev) => {
                                        const newObj = { ...prev };

                                        newObj[variant][idx] = value;
                                        return newObj;
                                      });
                                    }}
                                    deleteValue={() => {
                                      setAvailableVariants((prev) => {
                                        const newObj = { ...prev };
                                        newObj[variant].splice(idx, 1);
                                        return newObj;
                                      });

                                      console.log(availableVariants);
                                    }}
                                  />
                                </Checkbox>
                              );
                            })}
                            <IconButton
                              mt="16px"
                              colorScheme="blue"
                              icon={<AddIcon />}
                              onClick={(e) => {
                                const v = prompt('Enter variant');

                                console.log(
                                  availableVariants[variant].indexOf(v)
                                );

                                if (availableVariants[variant].indexOf(v) == -1)
                                  setAvailableVariants((prev) => {
                                    const newObj = { ...prev };

                                    newObj[variant].push(v);

                                    return newObj;
                                  });
                              }}
                            />
                          </CheckboxGroup>
                        </Flex>
                      );
                    })}
                  </Flex>
                </Flex>

                <Flex
                  alignItems="center"
                  mt="32px"
                  mb="16px"
                  gap="24px"
                  justifyContent="space-between"
                >
                  <Text
                    fontSize="2xl"
                    fontWeight="700"
                    color={textColor}
                    display="flex"
                  >
                    SKUs
                  </Text>
                  <Button
                    colorScheme="blue"
                    onClick={() =>
                      updateTable(
                        values.quantity,
                        values.price,
                        values.discountedPrice
                      )
                    }
                  >
                    Generate
                  </Button>
                </Flex>

                {/* For generating table entries dynamically */}
                <TableComp
                  columnsData={colData}
                  tableData={tableData}
                  editEntry={(e) => {
                    setEditModalSKUIndex(e[0].row.index);
                    setModalContext('Edit SKU');
                    onOpen();
                  }}
                  deleteEntry={(e) => {
                    setTableData((prev) => {
                      const u = [...prev];
                      u.splice(e[0].row.index, 1);

                      for (let i = 0; i < u.length; i++) {
                        u[i].quantity = Math.floor(values.quantity / u.length);
                      }
                      return u;
                    });
                  }}
                />

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
                            {skus} SKUs Created
                          </>
                        )}

                        {modalContext == 'Edit SKU' && (
                          <Formik
                            initialValues={{
                              price: tableData[editModalSKUIndex].price,
                              discountedPrice:
                                tableData[editModalSKUIndex].discountedPrice,
                              quantity: tableData[editModalSKUIndex].quantity
                            }}
                            onSubmit={(values) => {
                              setTableData((prev) => {
                                const u = [...prev];

                                u[editModalSKUIndex].price = values.price;
                                u[editModalSKUIndex].discountedPrice =
                                  values.discountedPrice;
                                u[editModalSKUIndex].quantity = values.quantity;

                                return u;
                              });
                            }}
                          >
                            {({ handleSubmit, errors, touched, values }) => (
                              <form>
                                <>
                                  <Flex direction="column">
                                    <FormControl
                                      mb="4px"
                                      isInvalid={
                                        !!errors.quantity && touched.quantity
                                      }
                                    >
                                      <FormLabel
                                        display="flex"
                                        ms="4px"
                                        fontSize="sm"
                                        fontWeight="500"
                                        color={textColor}
                                        mb="5px"
                                      >
                                        Quantity
                                        <Text color={brandStars}>*</Text>
                                      </FormLabel>
                                      <Field
                                        as={Input}
                                        isRequired={true}
                                        id="quantity"
                                        name="quantity"
                                        type="number"
                                        variant="auth"
                                        fontSize="sm"
                                        mb="3px"
                                        fontWeight="500"
                                        validate={(value) => {
                                          if (value == 0) {
                                            return 'Field can not be empty';
                                          }
                                        }}
                                      />
                                      <FormErrorMessage>
                                        {errors.quantity}
                                      </FormErrorMessage>
                                    </FormControl>

                                    <FormControl
                                      mb="4px"
                                      isInvalid={
                                        !!errors.price && touched.price
                                      }
                                    >
                                      <FormLabel
                                        display="flex"
                                        ms="4px"
                                        fontSize="sm"
                                        fontWeight="500"
                                        color={textColor}
                                        mb="5px"
                                      >
                                        Price<Text color={brandStars}>*</Text>
                                      </FormLabel>
                                      <Field
                                        as={Input}
                                        isRequired={true}
                                        id="price"
                                        name="price"
                                        variant="auth"
                                        type="number"
                                        fontSize="sm"
                                        mb="3px"
                                        fontWeight="500"
                                        validate={(value) => {
                                          if (value == 0) {
                                            return 'Field can not be empty';
                                          }
                                        }}
                                      />
                                      <FormErrorMessage>
                                        {errors.price}
                                      </FormErrorMessage>
                                    </FormControl>

                                    <FormControl
                                      mb="4px"
                                      isInvalid={
                                        !!errors.discountedPrice &&
                                        touched.discountedPrice
                                      }
                                    >
                                      <FormLabel
                                        display="flex"
                                        ms="4px"
                                        fontSize="sm"
                                        fontWeight="500"
                                        color={textColor}
                                        mb="5px"
                                      >
                                        Discounted Price
                                        <Text color={brandStars}>*</Text>
                                      </FormLabel>
                                      <Field
                                        as={Input}
                                        isRequired={true}
                                        id="discountedPrice"
                                        name="discountedPrice"
                                        variant="auth"
                                        type="number"
                                        fontSize="sm"
                                        mb="3px"
                                        fontWeight="500"
                                        validate={(value) => {
                                          if (value == 0) {
                                            return 'Field can not be empty';
                                          }
                                          if (value > values.price) {
                                            return 'Discounted price cannot be more than price';
                                          }
                                        }}
                                      />
                                      <FormErrorMessage>
                                        {errors.discountedPrice}
                                      </FormErrorMessage>
                                    </FormControl>
                                  </Flex>
                                  <Button
                                    colorScheme="blue"
                                    mt="16px"
                                    onClick={() => {
                                      handleSubmit();
                                      onClose();
                                    }}
                                  >
                                    Update
                                  </Button>
                                </>
                              </form>
                            )}
                          </Formik>
                        )}
                      </ModalBody>
                    </ModalContent>
                  </Modal>
                )}

                <FormControl>
                  <Button
                    fontSize="sm"
                    variant="brand"
                    mb="18px"
                    mt="20px"
                    onClick={() => {
                      handleSubmit();
                    }}
                  >
                    Create
                  </Button>
                </FormControl>
              </form>
            )}
          </Formik>
        </Flex>
      </Flex>
    </>
  );
}

export default CreateProduct;
