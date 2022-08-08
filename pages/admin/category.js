import Layout from '../../ui/layouts/admin';
import TableComp from '../../ui/components/table';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
  Button,
  Flex,
  Input,
  Text,
  Textarea,
  useColorModeValue,
  useDisclosure,
  useToast,
  Switch,
  Select,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  IconButton
} from '@chakra-ui/react';

import { SearchBar } from '../../ui/components/searchbar';
import useDebounce from '../../utils/hooks/useDebounce';
import { AddIcon, PlusSquareIcon } from '@chakra-ui/icons';

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
    Header: 'PARENT CATEGORY ID',
    accessor: 'parentCategoryId'
  },
  {
    Header: 'SLUG',
    accessor: 'slug'
  },
  {
    Header: 'ROOT',
    accessor: 'root'
  }
];

export default function CategoryPage() {
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
  const [parent, setParent] = useState(false);
  const [parentId, setParentId] = useState('');
  const [id, setID] = useState('');

  const debouncedSearchString = useDebounce(searchString, 800);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const router = useRouter();
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const bgColor = useColorModeValue('white', 'secondaryGray.900');

  const createCategory = async () => {
    console.log(name, description, slug);
    if (name == '' || description == '' || slug == '') {
      toast({
        title: 'One or more fields are empty!',
        status: 'error',
        duration: 2000,
        isClosable: true
      });
    } else if (parent && parentId == '') {
      toast({
        title: 'Parent ID not selected',
        status: 'error',
        duration: 2000,
        isClosable: true
      });
    } else {
      const body = {
        name,
        description,
        slug
      };

      if (parentId) {
        body.parentCategoryId = parentId;
      }

      const res = await fetch(
        `${router.basePath}/api/products/category/create`,
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
        console.log('Category created', await res.json());
        toast({
          title: 'Category created',
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

  const editCategory = async () => {
    console.log(name, description, slug);
    if (name == '' && description == '' && slug == '' && id == '') {
      toast({
        title: 'All fields are empty!',
        status: 'success',
        duration: 2000,
        isClosable: true
      });
    } else if (parent && !parentId) {
      toast({
        title: 'Parent ID not selected',
        status: 'error',
        duration: 2000,
        isClosable: true
      });
    } else if (parent && parentId == id)
      toast({
        title: 'Parent ID should not be same as the category Id for a category',
        status: 'error',
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

      if (parent) {
        body.parentCategoryId = parentId;
      }

      body.root = !parent;

      const res = await fetch(
        `${router.basePath}/api/products/category/update`,
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
        console.log('Category updated', await res.json());
        toast({
          title: 'Category updated',
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

  const deleteCategory = async () => {
    if (id == '') {
      toast({
        title: 'ID is missing!',
        status: 'error',
        duration: 2000,
        isClosable: true
      });
    } else {
      const body = {
        id
      };

      const res = await fetch(
        `${router.basePath}/api/products/category/delete`,
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
        console.log('Category deleted', await res.json());
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
    create: createCategory,
    edit: editCategory,
    delete: deleteCategory
  };

  const resetForm = () => {
    setName('');
    setDescription('');
    setSlug('');
    setParent(false);
    setParentId('');
    onClose();
  };

  const openCreate = () => {
    setModalHeading('Create Category');
    setModalBody('create');
    setModalFooter('Create');
    onOpen();
  };

  const openEdit = (cells) => {
    setModalHeading('Edit Category');
    setModalBody('edit');
    setModalFooter('Update');
    setID(cells[0].value);

    setName(cells[1].value);
    setDescription(cells[2].value);
    setSlug(cells[4].value);
    setParent(!!cells[3].value);
    setParentId(cells[3].value);

    onOpen();
  };

  const openDelete = (cells) => {
    setModalHeading('Delete Category');
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
    fetch(`${router.basePath}/api/products/category?${query}`, {
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
          return { categories: [] };
        }
        throw new Error(res_data.message);
      })
      .then((res) => {
        setData(res.categories);
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
    if (localStorage.getItem('page/admin/category'))
      setPage(parseInt(localStorage.getItem('page/admin/category'), 10));
  }, []);

  return (
    <>
      <Layout
        heading="Categories"
        searchString={searchString}
        setSearchString={setSearchString}
        placeholder="e.g. hello isRoot:true id:62bad0b6f4b8ec8aad5ced34"
      >
        <IconButton
          colorScheme="blue"
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
        <Modal isOpen={isOpen} onClose={resetForm}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>{modalHeading}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {(modalBody == 'create' || modalBody == 'edit') && (
                <>
                  <Text fontSize="14px" fontWeight={500}>
                    {modalBody == 'create' ? 'Name*' : 'Name'}
                  </Text>
                  <Input
                    mb="8px"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <Text fontSize="14px" fontWeight={500}>
                    {modalBody == 'create' ? 'Description*' : 'Description'}
                  </Text>
                  <Textarea
                    mb="8px"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                  <Text fontSize="14px" fontWeight={500}>
                    {modalBody == 'create' ? 'Slug*' : 'Slug'}
                  </Text>
                  <Input
                    mb="8px"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                  />
                  <Text fontSize="14px" fontWeight={500}>
                    Set Parent
                  </Text>
                  <Switch
                    mb="8px"
                    isChecked={parent}
                    onChange={() => setParent((prev) => !prev)}
                  />
                  {parent && (
                    <>
                      <Text fontSize="14px" fontWeight={500}>
                        Parent Category ID
                      </Text>
                      <Select
                        placeholder="Select parent category"
                        onChange={(e) => {
                          setParentId(
                            e.target.options[e.target.selectedIndex].value
                          );
                        }}
                      >
                        {data.map((category, index) => (
                          <option key={index} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </Select>
                    </>
                  )}
                </>
              )}

              {modalBody == 'delete' && (
                <>
                  <Text fontSize="14px" fontWeight={500}>
                    Are you sure?
                  </Text>
                </>
              )}
            </ModalBody>

            <ModalFooter>
              <Button
                fontSize={{ sm: '14px' }}
                colorScheme="blue"
                onClick={handler[modalBody]}
              >
                {modalFooter}
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </>
  );
}
