import { AddIcon } from '@chakra-ui/icons';
import {
  Button,
  Checkbox,
  CheckboxGroup,
  Flex,
  IconButton,
  Text,
  useColorModeValue
} from '@chakra-ui/react';
import React, { useState } from 'react';
import CustomEditable from '../CustomEditable';
import { HSeparator } from '../separator/Separator';
import EditableTable from '../table/EditableTable';

function VariantsForm({ onSubmit, values }) {
  const [variants, setVariants] = useState({});
  const [availableVariants, setAvailableVariants] = useState({
    Size: ['small', 'medium', 'large'],
    Colour: ['red', 'blue', 'green']
  });

  const textColor = useColorModeValue('navy.700', 'white');
  const bgColor = useColorModeValue('white', 'navy.800');

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
      accessor: 'quantity',
      type: 'editable'
    });

    newCol.push({
      Header: 'PRICE',
      accessor: 'price',
      type: 'editable'
    });

    newCol.push({
      Header: 'DISCOUNTED PRICE',
      accessor: 'discountedPrice',
      type: 'editable'
    });

    newCol.push({
      Header: 'FEATURE IMAGE',
      accessor: 'featureImage',
      type: 'image'
    });

    newCol.push({
      Header: 'GALLERY',
      accessor: 'gallery',
      type: 'imageArray'
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
      newTableData[i]['featureImage'] = '';
      newTableData[i]['gallery'] = [];
    }

    setColData(newCol);
    setTableData(newTableData);
  }

  return (
    <Flex direction="column">
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
                key={variant}
                direction="column"
                minW="200px"
                p="8px 16px"
                bgColor={bgColor}
                borderRadius="xl"
              >
                <CustomEditable
                  py="4px"
                  fontWeight="700"
                  value={variant}
                  setValue={(value) => {
                    if (value != variant) {
                      setAvailableVariants((prev) => {
                        const newObj = {
                          ...prev
                        };

                        Object.defineProperty(
                          newObj,
                          value,
                          Object.getOwnPropertyDescriptor(newObj, variant)
                        );
                        delete newObj[variant];

                        return newObj;
                      });

                      if (variants[variant]) {
                        setVariants((prev) => {
                          const newObj = {
                            ...prev
                          };

                          Object.defineProperty(
                            newObj,
                            value,
                            Object.getOwnPropertyDescriptor(newObj, variant)
                          );

                          delete newObj[variant];
                          return newObj;
                        });
                      }
                    }
                  }}
                  deleteValue={() => {
                    setAvailableVariants((prev) => {
                      const newObj = {
                        ...prev
                      };

                      delete newObj[variant];
                      return newObj;
                    });

                    if (variants[variant]) {
                      setVariants((prev) => {
                        const newObj = {
                          ...prev
                        };
                        delete newObj[variant];

                        return newObj;
                      });
                    }

                    updateTable(
                      values.quantity,
                      values.price,
                      values.discountedPrice
                    );

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

                    updateTable(
                      values.quantity,
                      values.price,
                      values.discountedPrice
                    );

                    console.log(variants);
                  }}
                >
                  {availableVariants[variant].map((val, idx) => {
                    return (
                      <Checkbox key={val} value={val}>
                        <CustomEditable
                          py="4px"
                          minW="200px"
                          value={val}
                          setValue={(value) => {
                            if (
                              availableVariants[variant].indexOf(value) == -1
                            ) {
                              setAvailableVariants((prev) => {
                                const newObj = {
                                  ...prev
                                };

                                newObj[variant][idx] = value;
                                return newObj;
                              });
                            } else
                              toast({
                                title: 'Attribute names must be unique',
                                status: 'error',
                                isClosable: true
                              });

                            if (
                              variants[variant] &&
                              variants[variant].indexOf(val) != -1
                            ) {
                              setVariants((prev) => {
                                const newObj = {
                                  ...prev
                                };
                                newObj[variant][
                                  variants[variant].indexOf(val)
                                ] = value;
                                return newObj;
                              });
                            }

                            console.log(availableVariants);
                            console.log(variants);
                          }}
                          deleteValue={() => {
                            setAvailableVariants((prev) => {
                              const newObj = {
                                ...prev
                              };
                              newObj[variant].splice(idx, 1);
                              return newObj;
                            });

                            if (
                              variants[variant] &&
                              variants[variant].indexOf(val) != -1
                            ) {
                              setVariants((prev) => {
                                const newObj = {
                                  ...prev
                                };
                                newObj[variant].splice(
                                  variants[variant].indexOf(val),
                                  1
                                );
                                return newObj;
                              });
                            }

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

                      console.log(availableVariants[variant].indexOf(v));

                      if (availableVariants[variant].indexOf(v) == -1)
                        setAvailableVariants((prev) => {
                          const newObj = {
                            ...prev
                          };

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
        <Text fontSize="2xl" fontWeight="700" color={textColor} display="flex">
          SKUs
        </Text>
        <Button
          colorScheme="blue"
          onClick={() =>
            updateTable(values.quantity, values.price, values.discountedPrice)
          }
        >
          Update
        </Button>
      </Flex>

      {/* For generating table entries dynamically */}
      <EditableTable
        columnsData={colData}
        tableData={tableData}
        setTableData={setTableData}
      />
      <Button
        maxW="max-content"
        ml="auto"
        mr="0"
        mt="24px"
        mb="8px"
        colorScheme="blue"
        onClick={() => {
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
          } else onSubmit({ variants, skus: tableData });
        }}
      >
        Next
      </Button>
    </Flex>
  );
}

export default VariantsForm;
