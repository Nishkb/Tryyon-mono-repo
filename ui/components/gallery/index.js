import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { Button, Flex, Image, Img } from '@chakra-ui/react';
import React, { useState } from 'react';

function GalleryComp({ images }) {
  const [idx, setIdx] = useState(0);

  return (
    <Flex direction="column" alignItems="center">
      <Flex justifyContent="space-between" alignItems="center" w="60vw">
        <Button
          colorScheme="blue"
          onClick={() => setIdx((prev) => prev - 1)}
          disabled={idx <= 0}
        >
          <ChevronLeftIcon />
        </Button>
        <Image h="56vh" maxW="50vw" src={images[idx]} alt="Gallery" />
        <Button
          colorScheme="blue"
          onClick={() => setIdx((prev) => prev + 1)}
          disabled={idx >= images.length - 1}
        >
          <ChevronRightIcon />
        </Button>
      </Flex>
      <Flex overflowX="scroll" maxW="60vw" my="8px" gap="8px">
        {images.map((img, index) => (
          <Img
            src={img}
            key={index}
            cursor="pointer"
            onClick={() => setIdx(index)}
            width="100px"
            height="100px"
            objectFit="cover"
            alt="Gallery Image Preview"
            filter={idx == index ? 'brightness(1)' : 'brightness(0.5)'}
          />
        ))}
      </Flex>
    </Flex>
  );
}

export default GalleryComp;
