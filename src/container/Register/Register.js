import React, {useState, useEffect, useContext} from 'react';
import {
  Box,
  Button,
  Select,
  Center,
  FormControl,
  Heading,
  HStack,
  Icon,
  Input,
  Text,
  VStack,
  WarningOutlineIcon,
  ScrollView,
  IconButton,
  useToast,
} from 'native-base';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ImagePicker from 'react-native-image-crop-picker';
import {Formik} from 'formik';
import * as Yup from 'yup';

import {getTypes, registerRequest} from '../../services/request';
import {isEmpty, isNull} from 'lodash';
import GlobalContext from '../../config/context';
import {setUser} from '../../utils/utils';
import {Toast} from '../../components';

const schema = Yup.object().shape({
  firstName: Yup.string()
    .min(1, 'First Name is too short!')
    .required('This field is required'),
  lastName: Yup.string()
    .min(1, 'Last Name is too short!')
    .required('This field is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('This field is required'),
  username: Yup.string()
    .min(4, 'Username is too short!')
    .required('This field is required'),
  password: Yup.string()
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
      'Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character',
    )
    .required('This field is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('This field is required'),
  type: Yup.string().required('This field is required'),
  attachment: Yup.string().required('This field is required'),
});

const initial = {
  firstName: '',
  lastName: '',
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  type: '',
  attachment: '',
};

const Register = ({navigation}) => {
  const {link} = useContext(GlobalContext);
  const [isLoading, setIsLoading] = useState(false);
  const [types, setTypes] = useState([]);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);
  const toast = useToast();

  useEffect(() => {
    getTypes().then(response => {
      setTypes(response.types);
    });
  }, []);

  const register = (values, {setFieldError, resetForm}) => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append('username', values.username);
    formData.append('password', values.password);
    formData.append('first_name', values.firstName);
    formData.append('last_name', values.lastName);
    formData.append('email', values.email);
    formData.append('type_id', values.type);
    formData.append('attachment', {
      uri: values.attachment,
      type: 'image/png',
      name: 'sample.png',
    });

    registerRequest(link, formData)
      .then(res => {
        setIsLoading(false);
        const {errors, data} = res;
        if (isNull(errors)) {
          resetForm();
          toast.show({
            render: () => {
              return (
                <Toast
                  type="success"
                  message="Account registered successfully."
                />
              );
            },
          });
          /*const user = {
            ...data.user,
            token: data.token,
          };
          setAuthenticatedUser(user);
          setUser(user);*/
        } else {
          errors.forEach(item => setFieldError(item.field, item.error));
        }
      })
      .catch(() => setIsLoading(false));
  };

  const handlePressUpload = setFieldValue => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
    }).then(image => {
      setFieldValue('attachment', image.path);
    });
  };

  return (
    <Box justifyContent="center" alignItems="center">
      <VStack marginY={10} w="90%" space={1}>
        <Heading color="muted.800">Let's Get Started!</Heading>
        <Text color="muted.400">Create an account</Text>
      </VStack>
      <Formik
        initialValues={initial}
        onSubmit={register}
        validationSchema={schema}>
        {({handleChange, handleSubmit, values, errors, setFieldValue}) => (
          <ScrollView w="90%" h="80%">
            <VStack space={3}>
              <FormControl isInvalid={'firstName' in errors}>
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
                  onChangeText={handleChange('firstName')}
                  value={values.firstName}
                  variant="outline"
                  placeholder="First Name"
                />
                <FormControl.ErrorMessage
                  ml="3"
                  leftIcon={<WarningOutlineIcon size="xs" />}>
                  {errors.firstName}
                </FormControl.ErrorMessage>
              </FormControl>
              <FormControl isInvalid={'lastName' in errors}>
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
                  onChangeText={handleChange('lastName')}
                  value={values.lastName}
                  variant="outline"
                  placeholder="Last Name"
                />
                <FormControl.ErrorMessage
                  ml="3"
                  leftIcon={<WarningOutlineIcon size="xs" />}>
                  {errors.lastName}
                </FormControl.ErrorMessage>
              </FormControl>
              <FormControl isInvalid={'email' in errors}>
                <Input
                  InputLeftElement={
                    <Icon
                      as={MaterialCommunityIcons}
                      name="email-outline"
                      color="muted.400"
                      size={5}
                      ml="2"
                    />
                  }
                  onChangeText={handleChange('email')}
                  value={values.email}
                  variant="outline"
                  placeholder="Email"
                />
                <FormControl.ErrorMessage
                  ml="3"
                  leftIcon={<WarningOutlineIcon size="xs" />}>
                  {errors.email}
                </FormControl.ErrorMessage>
              </FormControl>
              <FormControl isInvalid={'username' in errors}>
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
                  onChangeText={handleChange('username')}
                  value={values.username}
                  variant="outline"
                  placeholder="Username"
                />
                <FormControl.ErrorMessage
                  ml="3"
                  leftIcon={<WarningOutlineIcon size="xs" />}>
                  {errors.username}
                </FormControl.ErrorMessage>
              </FormControl>
              <FormControl isInvalid={'password' in errors}>
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
                  onChangeText={handleChange('password')}
                  value={values.password}
                  variant="outline"
                  placeholder="Password"
                  type={isPasswordVisible ? 'type' : 'password'}
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
                <FormControl.ErrorMessage
                  ml="3"
                  leftIcon={<WarningOutlineIcon size="xs" />}>
                  {errors.password}
                </FormControl.ErrorMessage>
              </FormControl>
              <FormControl isInvalid={'confirmPassword' in errors}>
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
                  onChangeText={handleChange('confirmPassword')}
                  value={values.confirmPassword}
                  variant="outline"
                  placeholder="Confirm Password"
                  type={isConfirmPasswordVisible ? 'type' : 'password'}
                  InputRightElement={
                    <IconButton
                      onPress={() =>
                        setIsConfirmPasswordVisible(!isConfirmPasswordVisible)
                      }
                      icon={
                        <Icon
                          as={MaterialCommunityIcons}
                          name={isConfirmPasswordVisible ? 'eye' : 'eye-off'}
                          color="muted.400"
                          size={5}
                        />
                      }
                    />
                  }
                />
                <FormControl.ErrorMessage
                  ml="3"
                  leftIcon={<WarningOutlineIcon size="xs" />}>
                  {errors.confirmPassword}
                </FormControl.ErrorMessage>
              </FormControl>
              <FormControl isInvalid={'type' in errors}>
                <Select
                  selectedValue={values.type}
                  placeholder="Choose Type"
                  _selectedItem={{
                    bg: 'primary.400',
                  }}
                  onValueChange={handleChange('type')}>
                  {types?.map(item => (
                    <Select.Item
                      key={item._id}
                      label={item.description}
                      value={item._id}
                    />
                  ))}
                </Select>
                <FormControl.ErrorMessage
                  ml="3"
                  leftIcon={<WarningOutlineIcon size="xs" />}>
                  {errors.type}
                </FormControl.ErrorMessage>
              </FormControl>
              <FormControl>
                <Button
                  variant="outline"
                  _text={{color: 'primary.500'}}
                  onPress={() => handlePressUpload(setFieldValue)}>
                  Upload Registration Form / ID
                </Button>
                {!isEmpty(errors.attachment) && (
                  <HStack alignItems="center" space={1} ml={3} mt={2}>
                    <WarningOutlineIcon size={3} color="error.600" />
                    <Text fontSize="xs" color="error.600">
                      {errors.attachment}
                    </Text>
                  </HStack>
                )}
              </FormControl>
            </VStack>
            <Button
              isLoading={isLoading}
              rounded="lg"
              size="lg"
              marginTop={10}
              w="60%"
              bg="primary.500"
              alignSelf="center"
              onPress={handleSubmit}>
              CREATE
            </Button>
            <Center>
              <HStack marginY={3} w="90%" space={1} justifyContent="center">
                <Text color="muted.900">Already have an account?</Text>
                <Text
                  color="blue.400"
                  bold
                  onPress={() => navigation.navigate('Login')}>
                  Login here
                </Text>
              </HStack>
            </Center>
          </ScrollView>
        )}
      </Formik>
    </Box>
  );
};

export default Register;
