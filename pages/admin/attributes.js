import Layout from '../../ui/layouts/admin';
import TableComp from '../../ui/components/table';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
    Button,
    Flex,
    IconButton,
    Input,
    Text,
    Textarea,
    useColorModeValue,
    useDisclosure,
    useToast
} from '@chakra-ui/react';

import { SearchBar } from '../../ui/components/searchbar';
import useDebounce from '../../utils/hooks/useDebounce';
import ModalComp from '../../ui/components/modal';
import { AddIcon } from '@chakra-ui/icons';

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
        Header: 'SLUG',
        accessor: 'slug'
    }
];

export default function AttributePage() {
    const toast = useToast();
    const [data, setData] = useState([]);
    const [page, setPage] = useState(0);
    const [searchString, setSearchString] = useState('');

    const [modalHeading, setModalHeading] = useState('');
    const [modalBody, setModalBody] = useState('');
    const [modalFooter, setModalFooter] = useState();

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [slug, setSlug] = useState('');
    const [id, setID] = useState('');

    const debouncedSearchString = useDebounce(searchString, 800);
    const { isOpen, onOpen, onClose } = useDisclosure();

    const router = useRouter();
    const textColor = useColorModeValue('secondaryGray.900', 'white');
    const bgColor = useColorModeValue('white', 'secondaryGray.900');

    const createAttribute = async () => {
        console.log(name, description, slug);
        if (name == '' || description == '' || slug == '')
            toast({
                title: 'One or more fields are empty!',
                status: 'error',
                duration: 2000,
                isClosable: true
            });
        else {
            const body = {
                name,
                description,
                slug
            };

            const res = await fetch(
                `${router.basePath}/api/products/attribute/create`,
                {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${sessionStorage.adminToken}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(body)
                }
            );

            if (res.ok) {
                console.log('Attribute created', await res.json());
                toast({
                    title: 'Attribute created',
                    status: 'success',
                    duration: 2000,
                    isClosable: true
                });
                setTimeout(() => {
                    router.reload();
                }, 800);
            } else {
                if (res.status == 401 || res.status == 403) {
                    // alert('Admin not logged in');
                    router.push(`/auth/admin/login?next=${router.pathname}`);
                }
                const data = await res.json();
                console.error(data.message);
                toast({
                    title: data.message,
                    status: 'error',
                    duration: 2000,
                    isClosable: true
                });
            }
        }
    };

    const editAttribute = async () => {
        console.log(name, description, slug);
        if (name == '' && description == '' && slug == '' && id == '')
            toast({
                title: 'All fields are empty!',
                status: 'success',
                duration: 2000,
                isClosable: true
            });
        else {
            const body = {
                id
            };

            if (name != '') {
                body.name = name;
            }

            if (description != '') {
                body.description = description;
            }

            if (slug != '') {
                body.slug = slug;
            }

            console.log(body);
            const res = await fetch(
                `${router.basePath}/api/products/attribute/update`,
                {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${sessionStorage.adminToken}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(body)
                }
            );

            if (res.ok) {
                console.log('Attribute updated', await res.json());
                toast({
                    title: 'Attribute updated',
                    status: 'success',
                    duration: 2000,
                    isClosable: true
                });
                setTimeout(() => {
                    router.reload();
                }, 800);
            } else {
                if (res.status == 401 || res.status == 403) {
                    // alert('Admin not logged in');
                    router.push(`/auth/admin/login?next=${router.pathname}`);
                }
                const data = await res.json();
                console.error(data.message);
                toast({
                    title: data.message,
                    status: 'error',
                    duration: 2000,
                    isClosable: true
                });
            }
        }
    };

    const deleteAttribute = async () => {
        if (id == '')
            toast({
                title: 'ID is missing!',
                status: 'error',
                duration: 2000,
                isClosable: true
            });
        else {
            const body = {
                id
            };

            const res = await fetch(
                `${router.basePath}/api/products/attribute/delete`,
                {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${sessionStorage.adminToken}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(body)
                }
            );

            if (res.ok) {
                console.log('Attribute deleted', await res.json());
                toast({
                    title: 'Category deleted',
                    status: 'success',
                    duration: 2000,
                    isClosable: true
                });
                setTimeout(() => {
                    router.reload();
                }, 800);
            } else {
                if (res.status == 401 || res.status == 403) {
                    // alert('Admin not logged in');
                    router.push(`/auth/admin/login?next=${router.pathname}`);
                }
                const data = await res.json();
                console.error(data.message);
                toast({
                    title: data.message,
                    status: 'error',
                    duration: 2000,
                    isClosable: true
                });
            }
        }
    };

    const handler = {
        create: createAttribute,
        edit: editAttribute,
        delete: deleteAttribute
    };

    const resetForm = () => {
        setName('');
        setDescription('');
        setSlug('');
        onClose();
    };

    const openCreate = () => {
        setModalHeading('Create Attribute');
        setModalBody('create');
        setModalFooter('Create');
        onOpen();
    };

    const openEdit = (cells) => {
        setModalHeading('Edit Attribute');
        setModalBody('edit');
        setModalFooter('Update');
        setID(cells[0].value);
        onOpen();
    };

    const openDelete = (cells) => {
        setModalHeading('Delete Attribute');
        setModalBody('delete');
        setModalFooter('Delete');
        setID(cells[0].value);
        onOpen();
    };

    useEffect(() => {
        let query = '',
            rest = '';
        const q = debouncedSearchString.split(/\s+/);
        q.forEach((e) => {
            let a = e.split(':');
            if (a.length == 2) {
                if (query != '') query += '&';
                query += `${a[0]}=${a[1]}`;
            } else {
                if (rest != '') rest += ' ';
                rest += e;
            }
        });
        if (rest) {
            if (query) query += '&';
            query += `query=${rest}`;
        }
        // console.log(query);
        fetch(`${router.basePath}/api/products/attribute?${query}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${sessionStorage.adminToken}`
            }
        })
            .then(async (res) => {
                const res_data = await res.json();
                if (res.ok) {
                    return res_data;
                }

                if (res.status == 403 || res.status == 401) {
                    // alert('Admin not logged in...');
                    router.push(`/auth/admin/login?next=${router.pathname}`);
                }

                if (res.status == 404) {
                    console.log(res_data.message);
                    toast({
                        title: res_data.message,
                        status: 'error',
                        duration: 2000,
                        isClosable: true
                    });
                    return { attributes: [] };
                }
                throw new Error(res_data.message);
            })
            .then((res) => {
                setData(res.attributes);
                // console.log(data);
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
    }, [router, debouncedSearchString, toast]);

    useEffect(() => {
        if (localStorage.getItem('page/admin/attributes'))
            setPage(
                parseInt(localStorage.getItem('page/admin/attributes'), 10)
            );
    }, []);

    return (
        <>
            <Layout
                heading="Attributes"
                searchString={searchString}
                setSearchString={setSearchString}
                placeholder="e.g. hello isRoot:true id:62bad0b6f4b8ec8aad5ced34"
            >
                <IconButton
                    colorScheme="telegram"
                    onClick={openCreate}
                    rounded="full"
                    w="70px"
                    h="70px"
                    position="fixed"
                    right="40px"
                    bottom="40px"
                    zIndex="1"
                    boxShadow="lg"
                >
                    <AddIcon />
                </IconButton>

                <TableComp
                    editEntry={openEdit}
                    deleteEntry={openDelete}
                    columnsData={columnsData}
                    tableData={data}
                    restore_page={page}
                />
            </Layout>
            {isOpen && (
                <ModalComp
                    isOpen={isOpen}
                    onOpen={onOpen}
                    onClose={resetForm}
                    footer={modalFooter}
                    heading={modalHeading}
                    handleSubmit={handler[modalBody]}
                >
                    {modalBody == 'create' && (
                        <>
                            <Text fontSize="14px" fontWeight={500}>
                                Name*
                            </Text>
                            <Input
                                mb="8px"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                            <Text fontSize="14px" fontWeight={500}>
                                Description*
                            </Text>
                            <Textarea
                                mb="8px"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                            <Text fontSize="14px" fontWeight={500}>
                                Slug*
                            </Text>
                            <Input
                                mb="8px"
                                value={slug}
                                onChange={(e) => setSlug(e.target.value)}
                            />
                        </>
                    )}

                    {modalBody == 'edit' && (
                        <>
                            <Text fontSize="14px" fontWeight={500}>
                                Name
                            </Text>
                            <Input
                                mb="8px"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                            <Text fontSize="14px" fontWeight={500}>
                                Description
                            </Text>
                            <Textarea
                                mb="8px"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                            <Text fontSize="14px" fontWeight={500}>
                                Slug
                            </Text>
                            <Input
                                mb="8px"
                                value={slug}
                                onChange={(e) => setSlug(e.target.value)}
                            />
                        </>
                    )}

                    {modalBody == 'delete' && (
                        <>
                            <Text fontSize="14px" fontWeight={500}>
                                Are you sure?
                            </Text>
                        </>
                    )}
                </ModalComp>
            )}
        </>
    );
}
