import { Button, Flex, Input } from '@chakra-ui/react';

import { useRef } from 'react';

export default function FileInput({ onChange, accept, multiple, ...rest }) {
  const fileInputRef = useRef();

  return (
    <Flex mx="auto" position="relative">
      <Button {...rest} onClick={() => fileInputRef.current.click()}>
        Upload
      </Button>
      <Input
        type={'file'}
        hidden
        accept={accept}
        multiple={multiple}
        onChange={onChange}
        ref={fileInputRef}
      />
    </Flex>
  );
}
