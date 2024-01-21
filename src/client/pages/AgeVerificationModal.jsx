import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  useToast,
  Center,
  Heading,
  VStack,
} from "@chakra-ui/react";
import Cookies from "js-cookie";

Modal.setAppElement("#root");

export function AgeVerificationModal() {
  const toast = useToast();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [dateOfBirth, setDateOfBirth] = useState("");

  useEffect(() => {
    const ageVerified = Cookies.get("ageVerified");
    if (!ageVerified) {
      setModalIsOpen(true);
    }
  }, []);

  const handleVerification = () => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    if (age >= 21) {
      Cookies.set("ageVerified", "true", { expires: 30 });
      setModalIsOpen(false);
      toast({
        title: "Age Verified",
        description: "You are now able to access this site.",
        status: "success",
        duration: 1000,
        isClosable: false,
      });
    } else {
      toast({
        title: "Verification Failed",
        description: "You must be at least 21 years old to access this site.",
        status: "error",
        duration: 1000,
        isClosable: false,
      });
      // go to google
      window.location.href = "https://www.google.com";
    }
  };

  return (
    <Modal
      isOpen={modalIsOpen}
      contentLabel="Age Verification"
      style={{
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          backdropFilter: "blur(10px)",
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
      <Center>
        <Box p={5}>
          <FormControl>
            <Center>
              <VStack>
                <Heading as={"h2"} mb={2}>
                  Age Verification
                </Heading>
                <FormLabel textAlign={"center"}>
                  This site is for users 21 years of age and older.
                </FormLabel>
              </VStack>
            </Center>
            <FormLabel htmlFor="date-of-birth" mt={4}>
              Enter your date of birth
            </FormLabel>
            <Input
              id="date-of-birth"
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
            />
            <Center>
            <Button mt={4} colorScheme="blue" onClick={handleVerification}>
              Verify Age
            </Button>
            </Center>
          </FormControl>
        </Box>
      </Center>
    </Modal>
  );
}

export default AgeVerificationModal;
