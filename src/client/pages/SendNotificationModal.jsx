// SendNotificationModal.js
import React from "react";
import Modal from "react-modal";
import {
  Button,
  CloseButton,
  Box,
  Center,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useAction } from "@wasp/actions";
import sendStrainNotification from "@wasp/actions/sendStrainNotification";

export function SendNotificationModal({
  modalIsOpen,
  closeModal,
  strain,
  dispensarySlug,
}) {
  const toast = useToast();
  const sendStrainNotificationFn = useAction(sendStrainNotification);

  const handleSendNotification = async () => {
    try {
      // Implement the action to send notification
      await sendStrainNotificationFn({ strainId: strain.id, dispensarySlug });
      closeModal();
      toast({
        title: "Notification sent",
        description: "The notification has been successfully sent.",
        status: "success",
        duration: 1000,
        isClosable: true,
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error sending notification",
        description: error.message || error.toString(),
        status: "error",
        duration: 1000,
        isClosable: true,
      });
    }
  };

  return (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={closeModal}
      contentLabel="Send Notification Modal"
      style={{
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        },
        content: {
          top: "50%",
          left: "50%",
          right: "auto",
          bottom: "auto",
          padding: "20px",
          marginRight: "-50%",
          transform: "translate(-50%, -50%)",
          width: "400px",
          borderRadius: "10px",
        },
      }}
    >
      <CloseButton
        position="absolute"
        zIndex={1}
        right="10px"
        top="10px"
        p={4}
        onClick={closeModal}
      />
      <Center>
        <Box>
          <Text mb={4}>
            Are you sure you want to send a notification for "{strain.name}"?
          </Text>
          <Button
            colorScheme="blue"
            onClick={() => {
              // Implement the action to send notification
              handleSendNotification();
            }}
          >
            Send Notification
          </Button>
        </Box>
      </Center>
    </Modal>
  );
}

export default SendNotificationModal;
