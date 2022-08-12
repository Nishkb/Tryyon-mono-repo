import {
    Button,
    Editable,
    EditableInput,
    EditablePreview,
    Flex,
    Image,
    Input,
    NumberInput,
    NumberInputField,
    Table,
    TableContainer,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr,
    useColorModeValue,
    useToast
} from '@chakra-ui/react';
import { useRouter } from 'next/router';

import React, { useEffect, useState } from 'react';

// Custom components
import Card from '../card/Card';
import FileInput from '../FileInput';

export default function EditableTable({
    columnsData,
    tableData,
    setTableData
}) {
    const toast = useToast();
    const router = useRouter();

    const textColor = useColorModeValue('secondaryGray.900', 'white');
    const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');

    return (
        <Card direction="column" w="100%" px="0px">
            <Flex overflowX={{ sm: 'scroll', lg: 'scroll' }} color={textColor}>
                <TableContainer overflowX="scroll">
                    <Table variant="simple">
                        <Thead>
                            <Tr>
                                {columnsData.map((col, index) => {
                                    return <Th key={index}>{col.Header}</Th>;
                                })}
                            </Tr>
                        </Thead>
                        <Tbody>
                            {tableData.map((row, index) => {
                                return (
                                    <Tr key={index}>
                                        {Object.keys(row).map((_, idx) => {
                                            if (
                                                columnsData[idx].type == 'image'
                                            ) {
                                                return (
                                                    <Td key={idx}>
                                                        <FileInput
                                                            accept="image/*"
                                                            colorScheme="blue"
                                                            mt="8px"
                                                            urlList={
                                                                tableData[
                                                                    index
                                                                ][
                                                                    columnsData[
                                                                        idx
                                                                    ].accessor
                                                                ]
                                                                    ? [
                                                                          tableData[
                                                                              index
                                                                          ][
                                                                              columnsData[
                                                                                  idx
                                                                              ]
                                                                                  .accessor
                                                                          ]
                                                                      ]
                                                                    : []
                                                            }
                                                            onChange={(e) => {
                                                                if (
                                                                    e.target
                                                                        .files[0]
                                                                        .size >
                                                                    2097152
                                                                ) {
                                                                    toast({
                                                                        title: `File ${e.target.files[0].name} is too large`,
                                                                        status: 'error',
                                                                        isClosable: true
                                                                    });
                                                                } else {
                                                                    const imageData =
                                                                        new FormData();
                                                                    imageData.append(
                                                                        'image',
                                                                        e.target
                                                                            .files[0]
                                                                    );
                                                                    fetch(
                                                                        '/api/upload/',
                                                                        {
                                                                            method: 'POST',
                                                                            headers:
                                                                                {
                                                                                    Authorization: `Bearer ${sessionStorage.token_admin}`
                                                                                },
                                                                            body: imageData
                                                                        }
                                                                    )
                                                                        .then(
                                                                            (
                                                                                res
                                                                            ) => {
                                                                                if (
                                                                                    res.ok
                                                                                ) {
                                                                                    return res.json();
                                                                                }

                                                                                if (
                                                                                    res.status ==
                                                                                        401 ||
                                                                                    res.status ==
                                                                                        403
                                                                                ) {
                                                                                    router.push(
                                                                                        `/auth/admin/login?next=${router.pathname}`
                                                                                    );
                                                                                    throw new Error(
                                                                                        JSON.stringify(
                                                                                            {
                                                                                                message:
                                                                                                    'Unauthorized Admin'
                                                                                            }
                                                                                        )
                                                                                    );
                                                                                }

                                                                                const err =
                                                                                    res.json();

                                                                                throw new Error(
                                                                                    JSON.stringify(
                                                                                        {
                                                                                            message:
                                                                                                err.message
                                                                                        }
                                                                                    )
                                                                                );
                                                                            }
                                                                        )
                                                                        .then(
                                                                            (
                                                                                res
                                                                            ) => {
                                                                                console.log(
                                                                                    res.body
                                                                                );
                                                                                setTableData(
                                                                                    (
                                                                                        prev
                                                                                    ) => {
                                                                                        const newArr =
                                                                                            [
                                                                                                ...prev
                                                                                            ];
                                                                                        newArr[
                                                                                            index
                                                                                        ][
                                                                                            columnsData[
                                                                                                idx
                                                                                            ].accessor
                                                                                        ] =
                                                                                            res.body.location;

                                                                                        return newArr;
                                                                                    }
                                                                                );
                                                                            }
                                                                        )
                                                                        .catch(
                                                                            (
                                                                                err
                                                                            ) => {
                                                                                toast(
                                                                                    {
                                                                                        title: err.message,
                                                                                        status: 'error',
                                                                                        isClosable: true
                                                                                    }
                                                                                );

                                                                                console.error(
                                                                                    err.message
                                                                                );
                                                                            }
                                                                        );
                                                                }
                                                            }}
                                                        />
                                                    </Td>
                                                );
                                            }

                                            if (
                                                columnsData[idx].type ==
                                                'imageArray'
                                            ) {
                                                return (
                                                    <Td key={idx}>
                                                        <FileInput
                                                            accept="image/*"
                                                            multiple
                                                            colorScheme="blue"
                                                            mt="8px"
                                                            urlList={
                                                                Array.isArray(
                                                                    tableData[
                                                                        index
                                                                    ][
                                                                        columnsData[
                                                                            idx
                                                                        ]
                                                                            .accessor
                                                                    ]
                                                                )
                                                                    ? tableData[
                                                                          index
                                                                      ][
                                                                          columnsData[
                                                                              idx
                                                                          ]
                                                                              .accessor
                                                                      ]
                                                                    : []
                                                            }
                                                            onChange={(e) => {
                                                                let flag = false;

                                                                if (
                                                                    e.target
                                                                        .files
                                                                        .length >
                                                                    5
                                                                ) {
                                                                    flag = true;
                                                                    toast({
                                                                        title: 'Only 5 images allowed at max',
                                                                        status: 'error',
                                                                        isClosable: true
                                                                    });
                                                                }

                                                                for (
                                                                    let i = 0;
                                                                    i <
                                                                    e.target
                                                                        .files
                                                                        .length;
                                                                    i++
                                                                ) {
                                                                    if (
                                                                        e.target
                                                                            .files[
                                                                            i
                                                                        ].size >
                                                                        2097152
                                                                    ) {
                                                                        flag = true;
                                                                        toast({
                                                                            title: `File ${e.target.files[i].name} is too large`,
                                                                            status: 'error',
                                                                            isClosable: true
                                                                        });
                                                                    }
                                                                }

                                                                if (!flag) {
                                                                    const imageData =
                                                                        new FormData();
                                                                    for (
                                                                        let i = 0;
                                                                        i <
                                                                        e.target
                                                                            .files
                                                                            .length;
                                                                        i++
                                                                    ) {
                                                                        imageData.append(
                                                                            'images',
                                                                            e
                                                                                .target
                                                                                .files[
                                                                                i
                                                                            ]
                                                                        );
                                                                    }

                                                                    fetch(
                                                                        '/api/upload/bulk',
                                                                        {
                                                                            method: 'POST',
                                                                            headers:
                                                                                {
                                                                                    Authorization: `Bearer ${sessionStorage.token_admin}`
                                                                                },
                                                                            body: imageData
                                                                        }
                                                                    )
                                                                        .then(
                                                                            (
                                                                                res
                                                                            ) => {
                                                                                if (
                                                                                    res.ok
                                                                                ) {
                                                                                    return res.json();
                                                                                }

                                                                                if (
                                                                                    res.status ==
                                                                                        401 ||
                                                                                    res.status ==
                                                                                        403
                                                                                ) {
                                                                                    router.push(
                                                                                        `/auth/admin/login?next=${router.pathname}`
                                                                                    );
                                                                                    throw new Error(
                                                                                        JSON.stringify(
                                                                                            {
                                                                                                message:
                                                                                                    'Unauthorized Admin'
                                                                                            }
                                                                                        )
                                                                                    );
                                                                                }

                                                                                const err =
                                                                                    res.json();

                                                                                throw new Error(
                                                                                    JSON.stringify(
                                                                                        {
                                                                                            message:
                                                                                                err.message
                                                                                        }
                                                                                    )
                                                                                );
                                                                            }
                                                                        )
                                                                        .then(
                                                                            (
                                                                                res
                                                                            ) => {
                                                                                console.log(
                                                                                    res.body
                                                                                );
                                                                                setTableData(
                                                                                    (
                                                                                        prev
                                                                                    ) => {
                                                                                        const newArr =
                                                                                            [
                                                                                                ...prev
                                                                                            ];
                                                                                        newArr[
                                                                                            index
                                                                                        ][
                                                                                            columnsData[
                                                                                                idx
                                                                                            ].accessor
                                                                                        ] =
                                                                                            res.body.map(
                                                                                                (
                                                                                                    img
                                                                                                ) =>
                                                                                                    img.location
                                                                                            );

                                                                                        return newArr;
                                                                                    }
                                                                                );
                                                                            }
                                                                        )
                                                                        .catch(
                                                                            (
                                                                                err
                                                                            ) => {
                                                                                toast(
                                                                                    {
                                                                                        title: err.message,
                                                                                        status: 'error',
                                                                                        isClosable: true
                                                                                    }
                                                                                );

                                                                                console.error(
                                                                                    err.message
                                                                                );
                                                                            }
                                                                        );
                                                                }
                                                            }}
                                                        />
                                                    </Td>
                                                );
                                            }

                                            if (
                                                columnsData[idx].type ==
                                                'editable'
                                            ) {
                                                return (
                                                    <Td
                                                        key={idx}
                                                        w="200px"
                                                        minW="200px"
                                                    >
                                                        <Editable
                                                            value={
                                                                row[
                                                                    columnsData[
                                                                        idx
                                                                    ].accessor
                                                                ]
                                                            }
                                                            onChange={(
                                                                value
                                                            ) => {
                                                                setTableData(
                                                                    (prev) => {
                                                                        const newArr =
                                                                            [
                                                                                ...prev
                                                                            ];
                                                                        newArr[
                                                                            index
                                                                        ][
                                                                            columnsData[
                                                                                idx
                                                                            ].accessor
                                                                        ] =
                                                                            parseInt(
                                                                                value,
                                                                                10
                                                                            ).toString() !==
                                                                            'NaN'
                                                                                ? parseInt(
                                                                                      value,
                                                                                      10
                                                                                  )
                                                                                : 0;
                                                                        return newArr;
                                                                    }
                                                                );
                                                            }}
                                                        >
                                                            <EditablePreview />
                                                            <EditableInput
                                                                as={Input}
                                                            />
                                                        </Editable>
                                                    </Td>
                                                );
                                            }

                                            return (
                                                <Td
                                                    key={idx}
                                                    w="200px"
                                                    minW="200px"
                                                >
                                                    {
                                                        row[
                                                            columnsData[idx]
                                                                .accessor
                                                        ]
                                                    }
                                                </Td>
                                            );
                                        })}
                                    </Tr>
                                );
                            })}
                        </Tbody>
                    </Table>
                </TableContainer>
            </Flex>
        </Card>
    );
}
