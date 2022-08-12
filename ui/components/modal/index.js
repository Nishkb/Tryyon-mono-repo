import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button
} from '@chakra-ui/react';

export default function ModalComp(props) {
    const { children, footer, isOpen, onOpen, onClose, heading, handleSubmit } =
        props;
    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>{heading}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>{children}</ModalBody>

                    <ModalFooter>
                        <Button
                            fontSize={{ sm: '14px' }}
                            colorScheme="blue"
                            onClick={handleSubmit}
                        >
                            {footer}
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}
