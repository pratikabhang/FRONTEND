import React, { useState } from 'react';
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  Heading,
  VStack,
  useToast,
  Progress,
} from '@chakra-ui/react';
import axios from 'axios';

const RegistrationPage = () => {
  const toast = useToast();
  const [step, setStep] = useState(1);
  const [processing, setProcessing] = useState(false);
  const [serverHash, setServerHash] = useState(null);

  const [formData, setFormData] = useState({
    code: '',
    studentNo: '',
    firstName: '',
    lastName: '',
    email: '',
  });

  const handleChange = async (e) => {
    const { name, value } = e.target;

    setFormData({ ...formData, [name]: value });

    if (name === 'code' && value.length > 3) {
      try {
        setProcessing(true);
        const response = await axios.post(
          'https://credbudbackend.onrender.com/token/verify',
          { code: value }
        );
        setServerHash(response.data); // Assuming response.data is the actual hash
        toast({
          title: 'Token Verified',
          description: 'The token is valid.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } catch (error) {
        setServerHash(null);
        toast({
          title: 'Invalid Token',
          description: 'Please enter a valid token.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setProcessing(false);
      }
    }
  };

  const handleNextStep = () => {
    if (step === 1 && !serverHash) {
      toast({
        title: 'Token Required',
        description: 'Please verify your token before proceeding.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (step < 3) {
      setStep(step + 1);
    } else {
      toast({
        title: 'Registration Successful',
        description: 'Student registered successfully!',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      // Reset everything
      setFormData({
        code: '',
        studentNo: '',
        firstName: '',
        lastName: '',
        email: '',
      });
      setServerHash(null);
      setStep(1);
    }
  };

  return (
    <Box
      maxW="md"
      mx="auto"
      minH="xl"
      mt="12"
      borderWidth={1}
      borderRadius={8}
      boxShadow="lg"
    >
      {processing && <Progress size="xs" isIndeterminate />}
      <Box p={8}>
        <Heading mb={4} textAlign="center">
          Student Registration
        </Heading>
        <Progress mb={4} value={(step / 3) * 100} />
        <VStack spacing={4}>
          {step === 1 && (
            <FormControl>
              <FormLabel>Token Number</FormLabel>
              <Input
                type="text"
                name="code"
                value={formData.code}
                onChange={handleChange}
                variant="filled"
              />
            </FormControl>
          )}

          {step === 2 && (
            <>
              <FormControl>
                <FormLabel>First Name</FormLabel>
                <Input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  variant="filled"
                />
              </FormControl>
              <FormControl>
                <FormLabel>Last Name</FormLabel>
                <Input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  variant="filled"
                />
              </FormControl>
            </>
          )}

          {step === 3 && (
            <FormControl>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                variant="filled"
              />
            </FormControl>
          )}

          <Button
            colorScheme="blue"
            onClick={handleNextStep}
            w="100%"
            isDisabled={processing}
          >
            {step < 3 ? 'Next' : 'Submit'}
          </Button>
        </VStack>
      </Box>
    </Box>
  );
};

export default RegistrationPage;
