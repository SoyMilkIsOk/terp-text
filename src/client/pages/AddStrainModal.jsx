import React, { useState } from "react";
import Modal from "react-modal";
import {
  Button,
  CloseButton,
  FormControl,
  FormLabel,
  Input,
  Switch,
  Box,
  useToast,
  Center,
  VStack,
  FormHelperText,
} from "@chakra-ui/react";
import { useAction } from "@wasp/actions";
import createStrain from "@wasp/actions/createStrain"; // Assuming createStrain is the correct action to call

export function AddStrainModal({ modalIsOpen, closeModal, dispensarySlug }) {
  const toast = useToast();
  const [strainName, setStrainName] = useState("");
  const [growerName, setGrowerName] = useState("");
  const [isAvailable, setIsAvailable] = useState(false);

  const createStrainFn = useAction(createStrain);

  const handleSubmit = async () => {
    try {
      await createStrainFn({
        name: strainName,
        grower: growerName,
        dispensarySlug,
        available: isAvailable,
      });
      closeModal();
      toast({
        title: "Strain created",
        description: "The new strain has been successfully created.",
        status: "success",
        duration: 1000,
        isClosable: true,
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error creating strain",
        description: "There was an error creating the new strain.",
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
      contentLabel="Add Strain Modal"
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
      <CloseButton position="absolute" zIndex={1} right="10px" top="10px" p={4} onClick={closeModal} />
      <Center>
        <VStack spacing={4}>
          <FormControl id="strain-name" isRequired>
            <FormLabel>Strain Name</FormLabel>
            <Input value={strainName} onChange={(e) => setStrainName(e.target.value)} />
          </FormControl>
          <FormControl id="grower-name" isRequired>
            <FormLabel>Grower Name</FormLabel>
            <Input value={growerName} onChange={(e) => setGrowerName(e.target.value)} />
          </FormControl>
          <FormControl id="availability" display="flex" alignItems="center">
            <FormLabel htmlFor="availability-switch" mb="0">
              Availability
            </FormLabel>
            <Switch id="availability-switch" isChecked={isAvailable} onChange={() => setIsAvailable(!isAvailable)} />
            <FormHelperText>Toggle to set the availability of the strain.</FormHelperText>
          </FormControl>
          <Button colorScheme="blue" onClick={handleSubmit}>
            Create Strain
          </Button>
        </VStack>
      </Center>
    </Modal>
  );
}

export default AddStrainModal;
