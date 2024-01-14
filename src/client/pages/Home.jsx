import React from "react";
import { Link } from "react-router-dom";
import useAuth from "@wasp/auth/useAuth";
import { useQuery } from "@wasp/queries";
import getAllDispensaries from "@wasp/queries/getAllDispensaries";
import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Link as ChakraLink,
  Tooltip,
  Container,
} from "@chakra-ui/react";
import { useEffect } from "react";

export const Home = () => {
  useEffect(() => {
    document.title = 'TerpText - Home';
  }, []);
  const { data: user } = useAuth();
  const { data: dispensaries } = useQuery(getAllDispensaries);

  const getTotalUsers = (dispensary) => {
    if (!dispensary.userStrains || !Array.isArray(dispensary.userStrains)) {
      return 0; // Return 0 if userStrains is not defined or not an array
    }

    const uniqueUserIds = new Set();
    dispensary.userStrains.forEach((us) => {
      if (us.userId) {
        uniqueUserIds.add(us.userId);
      }
    });

    return uniqueUserIds.size;
  };

  const getLastAvailableDropDate = (dispensary) => {
    const availableStrains = dispensary.strains.filter(
      (strain) => strain.available
    );
    const lastDropDate = availableStrains.reduce((latest, strain) => {
      const strainDate = new Date(strain.availableDate);
      return strainDate > latest ? strainDate : latest;
    }, new Date(0));
    return lastDropDate > new Date(0)
      ? lastDropDate.toLocaleDateString()
      : "N/A";
  };

  return (
    <Container minW="max-content">
      <Box p={4}>
        <Heading as="h1" mb={4}>
          All Dispensaries
        </Heading>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Dispensary Name</Th>
              <Th>Number of Strains</Th>
              <Th>Number of Users</Th>
              <Th>Last Drop Date</Th>
            </Tr>
          </Thead>
          <Tbody>
            {dispensaries?.map((dispensary) => (
              <Tr key={dispensary.id}>
                <Td>
                  <ChakraLink
                    as={Link}
                    to={`/${dispensary.name}`}
                    color="blue.500"
                  >
                    <Box display="flex" alignItems="center gap-2">
                      {dispensary.name.charAt(0).toUpperCase() +
                        dispensary.name.slice(1)}
                      {/* ✅ if user is signed up */}
                      {dispensary.userStrains.some(
                        (us) => us.userId === user?.id
                      ) && (
                        <Tooltip
                          label="You are enrolled in notifications from this dispensary"
                          aria-label="A tooltip"
                          placement="right"
                          hasArrow
                        >
                          <span className="ml-2"> ✅</span>
                        </Tooltip>
                      )}
                    </Box>
                  </ChakraLink>
                </Td>
                <Td>
                  {Array.isArray(dispensary.strains)
                    ? dispensary.strains.length
                    : "N/A"}
                </Td>
                <Td>{getTotalUsers(dispensary)}</Td>
                <Td>{getLastAvailableDropDate(dispensary)}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Container>
  );
};
