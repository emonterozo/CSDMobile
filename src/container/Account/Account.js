import React, {useContext, useState, useEffect} from 'react';
import {
  Box,
  Button,
  Select,
  FormControl,
  Icon,
  Input,
  VStack,
  WarningOutlineIcon,
  ScrollView,
  useToast,
} from 'native-base';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Formik} from 'formik';
import * as Yup from 'yup';

import {AppBar, Toast} from '../../components';
import GlobalContext from '../../config/context';
import {isEqual} from 'lodash';
import {getProfessorsRequest, updateUserRequest} from '../../services/request';

import {isNull} from 'lodash';
import {setUser} from '../../utils/utils';
import {STUDENT} from '../../utils/constant';

const schema = Yup.object().shape({
  firstName: Yup.string()
    .min(1, 'First Name is too short!')
    .required('This field is required'),
  lastName: Yup.string()
    .min(1, 'Last Name is too short!')
    .required('This field is required'),
  username: Yup.string()
    .min(4, 'Username is too short!')
    .required('This field is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('This field is required'),
  professor: Yup.string().required('This field is required').nullable(true),
});

const Account = ({navigation}) => {
  const {authenticatedUser, setAuthenticatedUser} = useContext(GlobalContext);
  const initial = {
    firstName: authenticatedUser.first_name,
    lastName: authenticatedUser.last_name,
    username: authenticatedUser.username,
    email: authenticatedUser.email,
    professor: authenticatedUser.professor?._id || 'professor',
  };
  const [isLoading, setIsLoading] = useState(false);
  const [professors, setProfessors] = useState([]);
  const toast = useToast();

  const submit = (values, {setFieldError}) => {
    setIsLoading(true);
    const payload = {
      id: authenticatedUser._id,
      first_name: values.firstName,
      last_name: values.lastName,
      username: values.username,
      email: values.email,
      professor_id: isEqual(
        authenticatedUser?.type.description.toLowerCase(),
        STUDENT,
      )
        ? values.professor
        : '',
    };

    updateUserRequest(payload, authenticatedUser.token)
      .then(res => {
        setIsLoading(false);
        const {errors, data} = res;

        if (isNull(errors)) {
          toast.show({
            render: () => {
              return (
                <Toast type="success" message="Account updated successfully." />
              );
            },
          });
          const user = {
            ...data.user,
            token: authenticatedUser.token,
          };
          setAuthenticatedUser(user);
          setUser(user);
        } else {
          errors.forEach(item => setFieldError(item.field, item.error));
        }
      })
      .catch(() => setIsLoading(false));
  };

  useEffect(() => {
    getProfessorsRequest().then(response => setProfessors(response.professors));
  }, []);

  return (
    <Box flex={1}>
      <AppBar title="Account" />
      <Box justifyContent="center" alignItems="center" marginTop={10}>
        <Formik
          initialValues={initial}
          onSubmit={submit}
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
                {isEqual(
                  authenticatedUser?.type.description.toLowerCase(),
                  STUDENT,
                ) && (
                  <FormControl isInvalid={'professor' in errors}>
                    <Select
                      selectedValue={values.professor}
                      placeholder="Choose Professor"
                      _selectedItem={{
                        bg: 'primary.400',
                      }}
                      onValueChange={handleChange('professor')}>
                      {professors?.map(item => (
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
                      {errors.professor}
                    </FormControl.ErrorMessage>
                  </FormControl>
                )}
              </VStack>
              <Button
                disabled={isEqual(values, initial)}
                bg={isEqual(values, initial) ? 'gray.400' : 'primary.500'}
                isLoading={isLoading}
                rounded="lg"
                size="lg"
                marginTop={10}
                w="60%"
                alignSelf="center"
                onPress={handleSubmit}>
                UPDATE
              </Button>
            </ScrollView>
          )}
        </Formik>
      </Box>
    </Box>
  );
};

export default Account;
