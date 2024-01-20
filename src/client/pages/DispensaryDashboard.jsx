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
  Center,
  Flex,
} from "@chakra-ui/react";
import { useQuery } from "@wasp/queries";
import { useAction } from "@wasp/actions";
import getStrains from "@wasp/queries/getStrains";
import getDispensary from "@wasp/queries/getDispensary";
import deleteStrain from "@wasp/actions/deleteStrain";
import { useParams } from "react-router-dom";
import updateStrainAvailability from "@wasp/actions/updateStrainAvailability";
import { FaRegTrashAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import { FaRegListAlt } from "react-icons/fa";
import { FaLock } from "react-icons/fa";
import { MdOutlineSms } from "react-icons/md";
import { FaCirclePlus } from "react-icons/fa6";
import Modal from "react-modal";
import AddStrainModal from "./AddStrainModal";

Modal.setAppElement("#root");

export function DispensaryDashboard() {
  const toast = useToast();
  const { slug } = useParams();

  const {
    data: dispensary,
    isLoading: dispensaryLoading,
    error: dispensaryError,
  } = useQuery(getDispensary, { slug: slug });

  const { data: strains, refetch } = useQuery(getStrains, {
    slug: slug,
  });

  const [modalIsOpen, setIsOpen] = useState(false);

  // Define action hooks
  const deleteStrainAction = useAction(deleteStrain);
  // const sendTextAction = useAction(sendText);

  //open add strain modal
  function handleAddStrain() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  const handleDeleteStrain = async (strainName, dispensarySlug) => {
    try {
      await deleteStrainAction({ strainName, dispensarySlug });
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
      if (sorted) {
        sorted.forEach((i) => {
          newStrainAvailability[i.strain.id] = i.available;
        });
      }
      setStrainAvailability(newStrainAvailability);
    }
    document.title = "TerpText - " + dispensary?.name + " - Dashboard";
  }, [strains]);

  const handleToggleAvailability = async (strain, currentAvailability) => {

    setStrainAvailability((prev) => ({
      ...prev,
      [strain.id]: !currentAvailability,
    }));

    try {
      await updateStrainAvailabilityAction({
        strainName: strain.name,
        dispensarySlug: slug,
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
    <Container minW="min-content">
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
          <Box>
            <Heading as="h2" size="lg" mb={2}>
              {dispensary?.name}
              's Strains:
            </Heading>
          </Box>
          <Spacer />
          <Box mr={2}>
            <Link to={"/" + dispensary?.slug}>
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
                <Flex>
                  Name <FaLock className="inline ml-1 mt-0.5" />
                </Flex>
              </Th>
              <Th>
                <Flex>
                  {" "}
                  Grower <FaLock className="inline ml-1 mt-0.5" />{" "}
                </Flex>
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
                    // onClick={() => handleSendText(i.strain.name)}
                  >
                    <MdOutlineSms />
                  </Button>
                </Td>
                <Td>
                  <Button
                    colorScheme="red"
                    onClick={() => handleDeleteStrain(i.strain.name, slug)}
                  >
                    <FaRegTrashAlt />
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
        <Center>
          <Button
            leftIcon={<FaCirclePlus />}
            colorScheme="blue"
            onClick={handleAddStrain}
            mt={4}
          >
            Add Strain
          </Button>
        </Center>
        <AddStrainModal
          modalIsOpen={modalIsOpen}
          closeModal={closeModal}
          dispensarySlug={slug}
          nonStrains={strains.map((i) => i.strain.id)}
        />
      </Box>
    </Container>
  );
}
