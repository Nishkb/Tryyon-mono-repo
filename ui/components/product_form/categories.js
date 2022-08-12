import {
  Flex,
  Radio,
  RadioGroup,
  Text,
  useToast,
  useColorModeValue,
  Button
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';

function CategoriesForm({ onSubmit, token }) {
  const router = useRouter();
  const toast = useToast();

  const [categories, setCategories] = useState({ root: [] });
  const [cat, setCat] = useState(['root']);

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
          }

          const err = res.json();

          throw new Error(
            JSON.stringify({
              message: err.message
            })
          );
        })
        .then((res) => {
          console.log(res.categories);
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

  useEffect(() => {
    fetch('/api/products/category?isRoot=true', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
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
          return { ...prev, root: res.categories };
        });
        console.log(res.categories);
      })
      .catch((err) => {
        console.error(err.message);
        toast({
          title: err.message,
          status: 'error',
          isClosable: true
        });
      });
  }, [toast, router, token]);

  return (
    <Flex direction="column">
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
      <Button
        maxW="max-content"
        ml="auto"
        mr="0"
        mt="24px"
        mb="8px"
        colorScheme="blue"
        onClick={() => {
          if (cat.length < 2) {
            toast({
              title: 'Category not selected',
              status: 'error',
              isClosable: true
            });
          } else onSubmit(cat[cat.length - 1]);
        }}
      >
        Next
      </Button>
    </Flex>
  );
}

export default CategoriesForm;
