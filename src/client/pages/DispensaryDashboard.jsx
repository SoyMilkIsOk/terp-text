import React, { useState, useEffect } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Box,
  Input,
  useToast,
} from "@chakra-ui/react";
import { useQuery } from "@wasp/queries";
import { useAction } from "@wasp/actions";
import getStrains from "@wasp/queries/getStrains";
import addStrain from "@wasp/actions/addStrain";
import deleteStrain from "@wasp/actions/deleteStrain";
import { useParams } from "react-router-dom";

export function DispensaryDashboard() {
  const toast = useToast();
  const { dispensaryName } = useParams();
  const { data: strains, refetch } = useQuery(getStrains, {
    name: dispensaryName,
  });
  const [newStrainName, setNewStrainName] = useState("");

  // Define action hooks
  const addStrainAction = useAction(addStrain);
  const deleteStrainAction = useAction(deleteStrain);

  const handleAddStrain = async () => {
    if (!newStrainName.trim()) {
      toast({
        title: "Error",
        description: "Strain name can't be empty",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    try {
      await addStrainAction({ name: newStrainName, dispensaryName });
      setNewStrainName("");
      refetch();
      toast({
        title: "Success",
        description: "Strain added successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: `An error occurred: ${error.message}`,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDeleteStrain = async (strainName) => {
    try {
      await deleteStrainAction({ strainName, dispensaryName });
      refetch();
      toast({
        title: "Success",
        description: "Strain deleted successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: `An error occurred: ${error.message}`,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  if (!strains) {
    return <Box>Loading...</Box>;
  }

  return (
    <Box p={4}>
      <Box mb={4}>
        <Input
          placeholder="Enter new strain name"
          value={newStrainName}
          onChange={(e) => setNewStrainName(e.target.value)}
        />
        <Button ml={2} colorScheme="blue" onClick={handleAddStrain}>
          Add Strain
        </Button>
      </Box>

      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Strain Name</Th>
            <Th>Action</Th>
          </Tr>
        </Thead>
        <Tbody>
          {strains.map((i) => (
            <Tr key={i.strain.id}>
              <Td>{i.strain.name}</Td>
              <Td>
                <Button
                  colorScheme="red"
                  onClick={() => handleDeleteStrain(i.strain.name)}
                >
                  Delete
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
}
