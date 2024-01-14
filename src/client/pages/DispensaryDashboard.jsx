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
  useToast,
  Switch,
  Heading,
  Spacer,
  Container,
} from "@chakra-ui/react";
import { useQuery } from "@wasp/queries";
import { useAction } from "@wasp/actions";
import getStrains from "@wasp/queries/getStrains";
import addStrain from "@wasp/actions/addStrain";
import deleteStrain from "@wasp/actions/deleteStrain";
import { useParams } from "react-router-dom";
import updateStrainAvailability from "@wasp/actions/updateStrainAvailability";
// import sendText from "@wasp/actions/sendText";
import { FaRegTrashAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import { FaRegListAlt } from "react-icons/fa";
import { FaLock } from "react-icons/fa";
import { MdOutlineSms } from "react-icons/md";

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
  // const sendTextAction = useAction(sendText);

  const handleAddStrain = async () => {
    if (!newStrainName.trim()) {
      toast({
        title: "Error",
        description: "Strain name can't be empty",
        status: "error",
        duration: 1000,
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
        duration: 1000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: `An error occurred: ${error.message}`,
        status: "error",
        duration: 1000,
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
        duration: 1000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: `An error occurred: ${error.message}`,
        status: "error",
        duration: 1000,
        isClosable: true,
      });
    }
  };

  // const handleSendText = async () => {
  // TBD
  // };

  const [strainAvailability, setStrainAvailability] = useState({});
  const updateStrainAvailabilityAction = useAction(updateStrainAvailability);

  const [sortedStrains, setSortedStrains] = useState([]);

  useEffect(() => {
    if (strains) {
      const sorted = [...strains].sort((a, b) =>
        a.strain.name.localeCompare(b.strain.name)
      );
      setSortedStrains(sorted);

      const newStrainAvailability = {};
      sorted.forEach((strain) => {
        newStrainAvailability[strain.id] = strain.available;
      });
      setStrainAvailability(newStrainAvailability);
    }
  }, [strains]);

  const handleToggleAvailability = async (strain, currentAvailability) => {
    // Optimistically update the UI
    setStrainAvailability((prev) => ({
      ...prev,
      [strain.id]: !currentAvailability,
    }));

    try {
      await updateStrainAvailabilityAction({
        strainName: strain.name,
        dispensaryName,
        available: !currentAvailability,
      });
      refetch();
      toast({
        title: "Success",
        description: `Strain availability updated successfully`,
        status: "success",
        duration: 1000,
        isClosable: true,
      });
    } catch (error) {
      // Revert the UI change in case of an error
      setStrainAvailability((prev) => ({
        ...prev,
        [strain.id]: currentAvailability,
      }));
      toast({
        title: "Error",
        description: `An error occurred: ${error.message}`,
        status: "error",
        duration: 1000,
        isClosable: true,
      });
    }
  };

  if (!strains) {
    return <Box>Loading...</Box>;
  }

  return (
    <Container minW="max-content">
      <Box p={4}>
        {/* <Box mb={4}>
        <Input
          placeholder="Enter new strain name"
          value={newStrainName}
          onChange={(e) => setNewStrainName(e.target.value)}
        />
        <Button ml={2} colorScheme="blue" onClick={handleAddStrain}>
          Add Strain
        </Button>
      </Box> */}

        {/* Title Your Strains */}
        <Box mb={4} display="flex">
          <Box ml={4}>
            <Heading as="h2" size="lg" mb={2}>
              {dispensaryName.charAt(0).toUpperCase() + dispensaryName.slice(1)}
              's Strains:
            </Heading>
          </Box>
          <Spacer />
          <Box mr={2}>
            <Link to={"/" + dispensaryName}>
              <Button rightIcon={<FaRegListAlt />} colorScheme="blue">
                Your Listing
              </Button>
            </Link>
          </Box>
        </Box>
        <Table variant="simple" mt={4}>
          <Thead>
            <Tr>
              <Th>
                Strain Name <FaLock className="inline ml-1 mb-1" />
              </Th>
              <Th>
                Grower <FaLock className="inline ml-1 mb-1" />
              </Th>
              <Th>Last Available</Th>
              <Th>Availablity</Th>
              <Th>Send Text</Th>
              <Th>Delete</Th>
            </Tr>
          </Thead>
          <Tbody>
            {sortedStrains.map((i) => (
              <Tr key={i.strain.id}>
                <Td>{i.strain.name}</Td>
                <Td>{i.strain.grower}</Td>
                <Td>{new Date(i.availableDate).toLocaleDateString("en-US")}</Td>
                <Td>
                  <Switch
                    isChecked={strainAvailability[i.strain.id]}
                    className="ml-5"
                    onChange={() =>
                      handleToggleAvailability(
                        i.strain,
                        strainAvailability[i.strain.id]
                      )
                    }
                  />
                </Td>
                <Td alignContent={"center"}>
                  <Button
                    colorScheme="blue"
                    className="ml-3"
                    // onClick={() => handleSendText(i.strain.name)}
                  >
                    <MdOutlineSms />
                  </Button>
                </Td>
                <Td>
                  <Button
                    colorScheme="red"
                    onClick={() => handleDeleteStrain(i.strain.name)}
                  >
                    <FaRegTrashAlt />
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Container>
  );
}
