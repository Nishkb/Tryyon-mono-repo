import Layout from '../../ui/layouts/user';
import TableComp from '../../ui/components/table';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import {
  Button,
  Flex,
  Text,
  useColorModeValue,
  useDisclosure,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  CheckboxGroup,
  Checkbox,
  Switch,
  Image
} from '@chakra-ui/react';

import { DownloadIcon } from '@chakra-ui/icons';

import { SearchBar } from '../../ui/components/searchbar';
import useDebounce from '../../utils/hooks/useDebounce';
import Facet from '../../ui/components/facet';
import { Field, Formik } from 'formik';
import GalleryComp from '../../ui/components/gallery';

const columnsData = [
  {
    Header: 'ID',
    accessor: 'id'
  },
  {
    Header: 'NAME',
    accessor: 'name'
  },
  {
    Header: 'DESCRIPTION',
    accessor: 'description'
  },
  {
    Header: 'SHORT DESCRIPTIONS',
    accessor: 'shortDescriptions'
  },
  {
    Header: 'SLUG',
    accessor: 'slug'
  },
  {
    Header: 'Quantity',
    accessor: 'quantity'
  },
  {
    Header: 'PUBLISHED',
    accessor: 'published'
  },
  {
    Header: 'SUPPLIER ID',
    accessor: 'supplierId'
  },
  {
    Header: 'CATEGORIES',
    accessor: 'categories'
  },
  {
    Header: 'MANUFACTURER',
    accessor: 'manufacturer'
  },
  {
    Header: 'LOCATIONS',
    accessor: 'locations'
  },
  {
    Header: 'COUNTRY OF ORIGIN',
    accessor: 'countryOfOrigin'
  },
  {
    Header: 'TRENDING',
    accessor: 'trending'
  },
  {
    Header: 'FEATURED FROM',
    accessor: 'featuredFrom'
  },
  {
    Header: 'FEATURED TO',
    accessor: 'featuredTo'
  },
  {
    Header: 'GUEST CHECKOUT',
    accessor: 'guestCheckout'
  },
  {
    Header: 'PRIVATE',
    accessor: 'private_product'
  },
  {
    Header: 'MARKET PLACE',
    accessor: 'marketPlace'
  },
  {
    Header: 'TYPE',
    accessor: 'reseller.type'
  },
  {
    Header: 'COMMISSION',
    accessor: 'reseller.commission'
  },
  {
    Header: 'DISCOUNT',
    accessor: 'reseller.discount'
  },
  {
    Header: 'FEATURE IMAGE',
    accessor: 'images'
  }
];

export default function UserProducts() {
  const toast = useToast();
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [searchString, setSearchString] = useState('');
  const [categoryQuery, setCategoryQuery] = useState('');
  const [attributesQuery, setAttributesQuery] = useState({});
  const [priceFrom, setPriceFrom] = useState(0);
  const [priceTo, setPriceTo] = useState(0);
  const [skus, setSKUs] = useState([]);

  const [galleryCell, setGalleryCell] = useState({});

  const debouncedSearchString = useDebounce(searchString, 1500);
  const debouncedCategoryQuery = useDebounce(categoryQuery, 1500);
  const debouncedAttributesQuery = useDebounce(attributesQuery, 1500);
  const debouncedPriceFrom = useDebounce(priceFrom, 1500);
  const debouncedPriceTo = useDebounce(priceTo, 1500);

  const [modalHeader, setModalHeader] = useState('');
  const [modalBody, setModalBody] = useState('');

  const [importProductId, setImportProductId] = useState('');
  const [importType, setImportType] = useState('');
  const [importValue, setImportValue] = useState(0);
  const [importIndex, setImportIndex] = useState(-1);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const router = useRouter();
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const bgColor = useColorModeValue('white', 'secondaryGray.900');

  useEffect(() => {
    if (!sessionStorage.userToken) {
      toast({
        title: 'Unauthorised user',
        status: 'error',
        duration: 2000,
        isClosable: true
      });

      router.push(`/auth/login?next=${router.pathname}`);
    } else {
      let query = {},
        rest = '';

      const accepted_values = [
        'id',
        'inStock',
        'published',
        'supplierId',
        'priceFrom',
        'priceTo'
      ];

      const q = debouncedSearchString.split(/\s+/);

      q.forEach((e) => {
        let a = e.split(':');
        if (a.length == 2 && accepted_values.indexOf(a[0]) != -1) {
          if (a[0] == 'inStock' || a[0] == 'published') {
            query[a[0]] = a[1] == 'true';
          } else if (a[0] == 'priceFrom' || a[0] == 'priceTo') {
            try {
              query[a[0]] = parseInt(a[1], 10);
            } catch (err) {
              toast({
                title: err.message,
                status: 'error',
                duration: 2000,
                isClosable: true
              });
            }
          } else query[a[0]] = a[1];
        } else {
          if (rest != '') rest += ' ';
          rest += e;
        }
      });

      if (rest) {
        query.query = rest;
      }

      if (debouncedCategoryQuery != '') {
        query.categoryId = debouncedCategoryQuery.id;
      }

      if (debouncedAttributesQuery != {}) {
        query.attributes = debouncedAttributesQuery;
      }

      if (debouncedPriceFrom > 0) {
        query.priceFrom = debouncedPriceFrom;
      }

      if (debouncedPriceTo > 0) {
        query.priceTo = debouncedPriceTo;
      }

      query.reseller = { allowed: true };
      query.excludeTenant = sessionStorage.tenantId;

      console.log(query);
      fetch(`${router.basePath}/api/products`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${sessionStorage.userToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(query)
      })
        .then(async (res) => {
          const res_data = await res.json();
          if (res.ok) {
            console.log(res_data);
            return res_data;
          }

          if (res.status == 403 || res.status == 401) {
            toast({
              title: 'Unauthorised user',
              status: 'error',
              duration: 2000,
              isClosable: true
            });
            router.push(`/auth/login?next=${router.pathname}`);
          }

          if (res.status == 404) {
            console.log(res_data.message);
            toast({
              title: res_data.message,
              status: 'error',
              duration: 2000,
              isClosable: true
            });
            return { products: [] };
          }
          throw new Error(res_data.message);
        })
        .then((res) => {
          setData([...res.products]);
        })
        .catch((err) => {
          console.log(err);
          toast({
            title: err.message,
            status: 'error',
            duration: 2000,
            isClosable: true
          });
        });
    }
  }, [
    router,
    debouncedSearchString,
    toast,
    debouncedAttributesQuery,
    debouncedCategoryQuery,
    debouncedPriceFrom,
    debouncedPriceTo
  ]);

  useEffect(() => {
    if (localStorage.getItem('page/products/browse'))
      setPage(parseInt(localStorage.getItem('page/products/browse'), 10));
  }, []);

  function createProductImport(type, productId, value, index) {
    setImportProductId(productId);
    setImportType(type);
    setImportValue(value);
    setImportIndex(index);

    fetch('/api/sku', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${sessionStorage.userToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ productId })
    })
      .then(async (res) => {
        if (res.ok) {
          return await res.json();
        }

        if (res.status == 403 || res.status == 401) {
          toast({
            title: 'Unauthorised user',
            status: 'error',
            duration: 2000,
            isClosable: true
          });
          router.push(`/auth/login?next=${router.pathname}`);
        }

        const err = await res.json();
        throw new Error(err.message);
      })
      .then((res) => {
        setSKUs(res.skus);
      })
      .catch((err) => {
        console.error(err.message);
        toast({
          title: err.message,
          status: 'error',
          duration: 2000,
          isClosable: true
        });
      });

    setModalBody('import');
    setModalHeader('Import Product');
    onOpen();
  }

  return (
    <>
      <Layout
        heading="Browse Products"
        searchString={searchString}
        setSearchString={setSearchString}
        placeholder="e.g. hello isRoot:true id:62bad0b6f4b8ec8aad5ced34"
      >
        <Facet
          category={categoryQuery}
          attributes={attributesQuery}
          setCategory={setCategoryQuery}
          setAttributes={setAttributesQuery}
          priceFrom={priceFrom}
          priceTo={priceTo}
          setPriceFrom={setPriceFrom}
          setPriceTo={setPriceTo}
          token={typeof window !== 'undefined' ? sessionStorage.userToken : ''}
        />

        <TableComp
          actions={[
            (cells) => {
              console.log(cells);

              if (
                cells[18].value == 'discount' ||
                cells[18].value == 'commission'
              ) {
                createProductImport(
                  cells[18].value,
                  cells[0].value,
                  cells[20].value ? cells[20].value : cells[19].value,
                  cells[0].row.index
                );
              } else {
                toast({
                  title: 'Import not allowed',
                  status: 'error',
                  duration: 2000,
                  isClosable: true
                });
              }
            }
          ]}
          actionButtons={[<DownloadIcon key={0} />]}
          columnsData={columnsData}
          tableData={data}
          restore_page={page}
          openGallery={(cell) => {
            setGalleryCell(cell);
            setModalHeader('Product Gallery');
            setModalBody('gallery');
            onOpen();
          }}
        />
      </Layout>
      {isOpen && (
        <Modal
          scrollBehavior="inside"
          size={modalBody == 'gallery' ? '5xl' : 'md'}
          isOpen={isOpen}
          onClose={onClose}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>{modalHeader}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {modalBody == 'import' && (
                <Formik
                  initialValues={{
                    skuIds: [],
                    status: false,
                    price: null
                  }}
                  onSubmit={(values) => {
                    const body = {
                      type: importType,
                      productId: importProductId,
                      status: values.status,
                      skuIds: values.skuIds
                    };

                    if (importType == 'discount') {
                      body.override = {
                        price: values.price,
                        sellingPrice:
                          values.price +
                          (parseInt(importValue) * values.price) / 100
                      };
                    }

                    fetch('/api/product_imports/create', {
                      method: 'POST',
                      headers: {
                        Authorization: `Bearer ${sessionStorage.userToken}`,
                        'Content-Type': 'application/json'
                      },
                      body: JSON.stringify(body)
                    })
                      .then(async (res) => {
                        if (res.ok) return await res.json();

                        if (res.status == 403 || res.status == 401) {
                          router.push(`/auth/login?next=${router.pathname}`);
                        }

                        const err = await res.json();
                        console.log(err);
                        throw new Error(err.message);
                      })
                      .then((res) => {
                        toast({
                          title: `Imported Product: ${res.productImport.product.name}`,
                          status: 'success',
                          isClosable: true
                        });

                        setData((prev) => {
                          const newArr = [...prev];
                          newArr.splice(importIndex, 1);

                          return newArr;
                        });

                        setImportProductId('');
                        setImportType('');
                        setImportValue(0);
                        setImportIndex(-1);

                        onClose();
                      })
                      .catch((err) => {
                        toast({
                          title: err.message,
                          status: 'error',
                          duration: 2000,
                          isClosable: true
                        });

                        console.error(err.message);
                      });
                  }}
                >
                  {({ handleSubmit, errors, touched, values, setValues }) => (
                    <form>
                      <Flex direction="column">
                        {importType == 'discount' && (
                          <>
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
                                Price*
                              </FormLabel>
                              <Field
                                as={Input}
                                isRequired={true}
                                id="price"
                                name="price"
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
                                {errors.price}
                              </FormErrorMessage>
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
                                Selling Price
                              </FormLabel>
                              <Field
                                as={Input}
                                value={
                                  values.price +
                                  (parseInt(importValue) * values.price) / 100
                                }
                                disabled
                                type="number"
                                variant="auth"
                                fontSize="sm"
                                mb="3px"
                                fontWeight="500"
                              />
                            </FormControl>
                          </>
                        )}

                        <FormLabel>SKUs</FormLabel>

                        <CheckboxGroup
                          onChange={(skuIds) =>
                            setValues((prev) => ({
                              ...prev,
                              skuIds
                            }))
                          }
                        >
                          {skus.map((sku, index) => (
                            <Checkbox key={index} mb="8px" value={sku.id}>
                              <Flex gap="4px">
                                {Object.keys(sku.attributes).map((e, idx) => (
                                  <Text key={idx}>
                                    {`${e}: ${sku.attributes[e]},`}
                                  </Text>
                                ))}
                              </Flex>
                            </Checkbox>
                          ))}
                        </CheckboxGroup>

                        <FormControl
                          mt="12px"
                          display="flex"
                          alignItems="center"
                        >
                          <FormLabel htmlFor="marketPlace" name="marketPlace">
                            Status
                          </FormLabel>
                          <Field
                            as={Switch}
                            id="status"
                            name="status"
                            variant="auth"
                            fontSize="sm"
                            mb="3px"
                            fontWeight="500"
                            size="md"
                          />
                        </FormControl>
                      </Flex>
                      <Button
                        colorScheme="blue"
                        mt="12px"
                        mb="16px"
                        float="right"
                        onClick={() => {
                          handleSubmit();
                        }}
                      >
                        Create
                      </Button>
                    </form>
                  )}
                </Formik>
              )}
              {modalBody == 'gallery' && (
                <GalleryComp
                  images={data[galleryCell.row.index][galleryCell.column.id]}
                />
              )}
            </ModalBody>
          </ModalContent>
        </Modal>
      )}
    </>
  );
}
