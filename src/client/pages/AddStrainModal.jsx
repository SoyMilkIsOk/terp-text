import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import {
  Button,
  CloseButton,
  FormControl,
  FormLabel,
  Select,
  Box,
  useToast,
  Center,
} from "@chakra-ui/react";
import { useQuery } from "@wasp/queries";
import getAllStrains from "@wasp/queries/getAllStrains";
import { useAction } from "@wasp/actions";
import createDispensaryStrain from "@wasp/actions/createDispensaryStrain";

export function AddStrainModal({ modalIsOpen, closeModal, dispensarySlug, nonStrains }) {
  const toast = useToast();
  const [selectedStrain, setSelectedStrain] = useState("");
  const [addableStrains, setAddableStrains] = useState([]);

  const { data: strains, isLoading } = useQuery(getAllStrains);

  useEffect(() => {
    if (strains && strains.length > 0) {
      const filteredStrains = strains.filter(strain => !nonStrains.includes(strain.id));
      setAddableStrains(filteredStrains);
    }
  }, [strains, nonStrains]);

  const createDispensaryStrainFn = useAction(createDispensaryStrain);

  const handleSubmit = async () => {
    try {
      await createDispensaryStrainFn({
        dispensarySlug,
        strainName: selectedStrain,
      });
      closeModal();
      toast({
        title: "Strain added",
        description: "The strain has been successfully added to the dispensary.",
        status: "success",
        duration: 1000,
        isClosable: true,
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error adding strain",
        description: "There was an error adding the strain to the dispensary.",
        status: "error",
        duration: 1000,
        isClosable: true,
      });
    }
  };

  if (isLoading) {
    return <Box>Loading...</Box>;
  }

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
      <CloseButton
        position="absolute"
        zIndex={1}
        right="10px"
        top="10px"
        p={4}
        onClick={closeModal}
      />
      <Center>
        <FormControl id="strain-select" isRequired>
          <FormLabel>Select a Strain</FormLabel>
          <Select
            placeholder="Select strain"
            value={selectedStrain}
            onChange={(e) => setSelectedStrain(e.target.value)}
          >
            {addableStrains.map((strain) => (
              <option key={strain.name} value={strain.name}>
                {strain.name} - {strain.grower}
              </option>
            ))}
          </Select>
          <Button
            mt={4}
            colorScheme="blue"
            onClick={() => handleSubmit()}
          >
            Add Strain
          </Button>
        </FormControl>
      </Center>
    </Modal>
  );
}

export default AddStrainModal;
