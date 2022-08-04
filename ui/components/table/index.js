import {
  Button,
  Flex,
  Image,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue
} from '@chakra-ui/react';

import {
  EditIcon,
  DeleteIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from '@chakra-ui/icons';
import React, { useEffect, useMemo } from 'react';
import {
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable
} from 'react-table';

// Custom components
import Card from '../card/Card';
import { useRouter } from 'next/router';

export default function TableComp(props) {
  const {
    columnsData,
    tableData,
    editEntry,
    deleteEntry,
    actions,
    actionButtons,
    restore_page,
    openGallery
  } = props;

  const columns = useMemo(() => columnsData, [columnsData]);
  const data = useMemo(() => tableData, [tableData]);

  const tableInstance = useTable(
    {
      columns,
      data
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    initialState,
    state: { pageIndex, pageSize }
  } = tableInstance;

  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
  const router = useRouter();

  initialState.pageIndex =
    restore_page < pageCount && restore_page > 0 ? restore_page : 0;

  const next = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(`page${router.pathname}`, pageIndex + 1);
    }
    nextPage();
  };

  const prev = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(`page${router.pathname}`, pageIndex - 1);
    }
    previousPage();
  };

  return (
    <Card direction="column" w="100%" px="0px">
      <Flex overflowX={{ sm: 'scroll', lg: 'scroll' }}>
        <Table {...getTableProps()} variant="simple" color="gray.500" mb="24px">
          <Thead>
            {headerGroups.map((headerGroup, index) => (
              <Tr {...headerGroup.getHeaderGroupProps()} key={index}>
                {headerGroup.headers.map((column, index) => (
                  <Th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    pe="10px"
                    key={index}
                    borderColor={borderColor}
                  >
                    <Flex
                      justify="space-between"
                      align="center"
                      fontSize={{ sm: '10px', lg: '12px' }}
                      color="gray.500"
                    >
                      <Text>{column.render('Header')}</Text>
                      {column.isSortedDesc === true && <ChevronUpIcon />}
                      {column.isSortedDesc === false && <ChevronDownIcon />}
                      {column.isSortedDesc === undefined && (
                        <Flex direction="column">
                          <ChevronUpIcon />
                          <ChevronDownIcon />
                        </Flex>
                      )}
                    </Flex>
                  </Th>
                ))}
                <Th pe="10px" borderColor={borderColor} key="ACTION">
                  <Flex
                    justify="space-between"
                    align="center"
                    fontSize={{ sm: '10px', lg: '12px' }}
                    color="gray.500"
                  >
                    ACTION
                  </Flex>
                </Th>
              </Tr>
            ))}
          </Thead>
          <Tbody {...getTableBodyProps()}>
            {page.map((row, index) => {
              prepareRow(row);
              return (
                <Tr {...row.getRowProps()} key={index}>
                  {row.cells.map((cell, index) => {
                    let data = '';
                    columns.forEach((col) => {
                      if (cell.column.Header === col.Header) {
                        if (
                          cell.column.Header.toLowerCase().includes('image')
                        ) {
                          data = (
                            <Flex
                              align="center"
                              onClick={() => openGallery(cell)}
                              cursor="pointer"
                            >
                              <Image
                                src={cell.value[0]}
                                alt="Product Image"
                                maxW="100px"
                              />
                            </Flex>
                          );
                        } else if (Array.isArray(cell.value)) {
                          let internal_data = cell.value.map((val, index) => (
                            <Flex
                              key={index}
                              borderRadius="2xl"
                              bgColor="blue.500"
                              p="8px 16px"
                              mr="4px"
                              align="center"
                            >
                              <Text
                                color="white"
                                fontSize="sm"
                                fontWeight="700"
                              >
                                {val.name}
                              </Text>
                            </Flex>
                          ));
                          data = <Flex>{internal_data}</Flex>;
                        } else {
                          data = (
                            <Flex align="center">
                              <Text
                                color={textColor}
                                fontSize="sm"
                                fontWeight="400"
                              >
                                {typeof cell.value == 'boolean'
                                  ? cell.value.toString()
                                  : cell.value}
                              </Text>
                            </Flex>
                          );
                        }
                      }
                    });

                    return (
                      <Td
                        {...cell.getCellProps()}
                        key={index}
                        fontSize={{ sm: '14px' }}
                        minW={{
                          sm: '150px',
                          md: '200px',
                          lg:
                            cell.column.Header == 'DESCRIPTION'
                              ? '300px'
                              : '200px'
                        }}
                        borderColor="transparent"
                      >
                        {data}
                      </Td>
                    );
                  })}
                  <Td
                    display="flex"
                    alignItems="center"
                    minW={{ sm: '150px', md: '200px', lg: 'auto' }}
                    borderColor="transparent"
                    key="ACTION"
                  >
                    {editEntry && (
                      <Button
                        fontSize={{ sm: '14px' }}
                        m="8px"
                        colorScheme="blue"
                        onClick={() => editEntry(row.cells)}
                      >
                        <EditIcon />
                      </Button>
                    )}

                    {deleteEntry && (
                      <Button
                        fontSize={{ sm: '14px' }}
                        colorScheme="red"
                        onClick={() => deleteEntry(row.cells)}
                      >
                        <DeleteIcon />
                      </Button>
                    )}

                    {actions &&
                      Array.isArray(actions) &&
                      actions.map((action, index) => (
                        <Button
                          key={index}
                          fontSize={{ sm: '14px' }}
                          colorScheme="blue"
                          onClick={() => action(row.cells)}
                        >
                          {actionButtons[index]}
                        </Button>
                      ))}
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </Flex>
      {pageCount !== 0 && (
        <Flex m="auto" alignItems="center">
          <Button disabled={!canPreviousPage} onClick={prev}>
            <ChevronLeftIcon />
          </Button>
          <Text mx="16px" fontSize="14px">
            <b>{pageIndex + 1}</b> | {pageCount}
          </Text>
          <Button disabled={!canNextPage} onClick={next}>
            <ChevronRightIcon />
          </Button>
        </Flex>
      )}
    </Card>
  );
}
