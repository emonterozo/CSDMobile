import React, {useContext, useState, useEffect} from 'react';
import {ImageBackground, StyleSheet} from 'react-native';
import {
  Box,
  Button,
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

  const handlePressForgotPassword = () => {
    toast.show({
      render: () => {
        return (
          <Toast
            type="error"
            message="Email sent successfully. Please check your email"
          />
        );
      },
    });
  };

  return (
    <Box flex={1} justifyContent="center" alignItems="center">
      <ImageBackground
        source={require('../../assets/login.png')}
        resizeMode="cover"
        style={styles.image}>
        <VStack w="90%" space={3} mt={40}>
          {!isEmpty(error) && (
            <HStack alignItems="center" space={1} mb={3}>
              <WarningOutlineIcon size="4" color="error.500" />
              <Text color="error.500" w="85%" bold>
                {error}
              </Text>
            </HStack>
          )}
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
            variant="filled"
            placeholder="Username"
          />
          <VStack space={1}>
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
              variant="filled"
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
            <Text
              alignSelf="flex-end"
              color="blue.400"
              bold
              onPress={() => navigation.navigate('ForgotPassword')}>
              Forgot Password?
            </Text>
          </VStack>
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
          rounded="lg"
          size="lg"
          bgColor="white"
          _text={{
            color: 'blue.400',
          }}
          w="70%"
          onPress={() => setAuthenticatedUser(GUEST_USER)}>
          Continue as Visitor
        </Button>
      </ImageBackground>
    </Box>
  );
};

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Login;
