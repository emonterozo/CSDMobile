import React, {useContext, useState, useEffect} from 'react';
import {
  Box,
  Button,
  Heading,
  HStack,
  Icon,
  Input,
  Text,
  VStack,
  WarningOutlineIcon,
  useToast,
  IconButton,
} from 'native-base';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import GlobalContext from '../../config/context';
import {loginRequest} from '../../services/request';
import {isEmpty, isEqual, isNull} from 'lodash';
import {setUser} from '../../utils/utils';
import {GUEST_USER, STATUS_PENDING} from '../../utils/constant';
import {Toast} from '../../components';

const Login = ({navigation}) => {
  const {setAuthenticatedUser} = useContext(GlobalContext);
  const [error, setError] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const toast = useToast();

  useEffect(() => {
    if (!isEmpty(error)) {
      setError('');
    }
  }, [username, password]);

  const handlePressLogin = () => {
    setIsLoading(true);
    const payload = {
      username: username,
      password: password,
    };
    loginRequest(payload)
      .then(res => {
        setIsLoading(false);
        const {data} = res;
        if (isNull(res.error)) {
          if (isEqual(data.user.status, STATUS_PENDING)) {
            toast.show({
              render: () => {
                return (
                  <Toast
                    type="error"
                    message="Your account is not yet approved."
                  />
                );
              },
            });
          } else {
            const user = {
              ...data.user,
              token: data.token,
            };
            setAuthenticatedUser(user);
            setUser(user);
          }
        } else {
          setError(res.error);
        }
      })
      .catch(() => setIsLoading(false));
  };

  return (
    <Box flex={1} justifyContent="center" alignItems="center">
      <VStack w="90%" space={1} marginBottom="10">
        <Heading color="muted.800">Welcome back!</Heading>
        <Text color="muted.400">Login with your existing account</Text>
      </VStack>
      {!isEmpty(error) && (
        <HStack alignItems="center" space={1} mb={3}>
          <WarningOutlineIcon size="4" color="error.500" />
          <Text color="error.500" w="85%">
            {error}
          </Text>
        </HStack>
      )}
      <VStack w="90%" space={3}>
        <Input
          InputLeftElement={
            <Icon
              as={MaterialCommunityIcons}
              name="account-outline"
              color="muted.400"
              size={5}
              ml="2"
            />
          }
          onChangeText={setUsername}
          value={username}
          variant="outline"
          placeholder="Username"
        />
        <Input
          InputLeftElement={
            <Icon
              as={MaterialCommunityIcons}
              name="lock-outline"
              color="muted.400"
              size={5}
              ml="2"
            />
          }
          onChangeText={setPassword}
          value={password}
          type={isPasswordVisible ? 'type' : 'password'}
          variant="outline"
          placeholder="Password"
          InputRightElement={
            <IconButton
              onPress={() => setIsPasswordVisible(!isPasswordVisible)}
              icon={
                <Icon
                  as={MaterialCommunityIcons}
                  name={isPasswordVisible ? 'eye' : 'eye-off'}
                  color="muted.400"
                  size={5}
                />
              }
            />
          }
        />
      </VStack>
      <Button
        isLoading={isLoading}
        isLoadingText="Loading"
        variant="solid"
        rounded="lg"
        size="lg"
        marginTop={10}
        marginBottom={3}
        bg="primary.500"
        w="60%"
        onPress={handlePressLogin}>
        LOG IN
      </Button>
      <HStack w="90%" space={1} justifyContent="center">
        <Text color="muted.900">Don't have account?</Text>
        <Text
          color="blue.400"
          bold
          onPress={() => navigation.navigate('Register')}>
          Sign Up
        </Text>
      </HStack>
      <Button
        mt={5}
        variant="outline"
        rounded="lg"
        size="lg"
        colorScheme="lightBlue"
        w="70%"
        onPress={() => setAuthenticatedUser(GUEST_USER)}>
        Continue as Visitor
      </Button>
    </Box>
  );
};

export default Login;
