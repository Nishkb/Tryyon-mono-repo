import { Button, Flex, Image, Input } from '@chakra-ui/react';

import { useRef, useState } from 'react';

export default function FileInput({
    onChange,
    accept,
    multiple,
    urlList,
    ...rest
}) {
    const fileInputRef = useRef();
    const [files, setFiles] = useState([]);

    return (
        <Flex position="relative" direction="column">
            {urlList && accept == 'image/*' && (
                <Flex gap="4px" maxW="300px" overflowX="scroll">
                    {urlList.map((img, j) => {
                        console.log(img, urlList);
                        return (
                            <Image
                                w="100px"
                                key={j}
                                src={img}
                                alt={img.split('/')[img.split('/').length - 1]}
                            />
                        );
                    })}
                </Flex>
            )}
            <Button {...rest} onClick={() => fileInputRef.current.click()}>
                {files.length == 0
                    ? 'Upload'
                    : files.length == urlList.length
                    ? 'Uploaded'
                    : 'Uploading'}
            </Button>
            <Input
                type={'file'}
                hidden
                accept={accept}
                multiple={multiple}
                onChange={(e) => {
                    setFiles(Array.from(e.target.files));
                    onChange(e);
                }}
                ref={fileInputRef}
            />
        </Flex>
    );
}
