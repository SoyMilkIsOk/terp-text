// SendNotificationModal.js
import React from "react";
import Modal from "react-modal";
import {
  Button,
  CloseButton,
  Box,
  Center,
  Text,
} from "@chakra-ui/react";

export function SendNotificationModal({ modalIsOpen, closeModal, strainName }) {
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
          <Text mb={4}>Are you sure you want to send a notification for "{strainName}"?</Text>
          <Button
            colorScheme="blue"
            onClick={() => {
              // Implement the action to send notification
              closeModal();
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
