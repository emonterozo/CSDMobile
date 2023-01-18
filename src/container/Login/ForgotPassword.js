import React, {useState} from 'react';
import {
  Box,
  Button,
  FormControl,
  Heading,
  Icon,
  Input,
  Text,
  VStack,
  WarningOutlineIcon,
  useToast,
} from 'native-base';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {isNull} from 'lodash';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {forgotPasswordRequest} from '../../services/request';
import {Toast} from '../../components';

const schema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('This field is required'),
});

const initial = {
  email: '',
};

const ForgotPassword = ({navigation}) => {
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const send = (values, {setFieldError, resetForm}) => {
    setIsLoading(true);
    forgotPasswordRequest(values.email)
      .then(res => {
        setIsLoading(false);
        if (isNull(res.error)) {
          resetForm();
          toast.show({
            render: () => {
              return (
                <Toast
                  type="success"
                  message="Email sent successfully. Please check your email for detailed instructions."
                />
              );
            },
          });
          navigation.goBack();
        } else {
          setFieldError('email', res.error);
        }
      })
      .catch(err => console.log(err));
    console.log(values);
  };

  return (
    <Box flex={1} justifyContent="center" alignItems="center">
      <VStack marginY={10} w="90%" space={1}>
        <Heading color="muted.800">Forgot Password?</Heading>
        <Text color="muted.400">Input your email to continue</Text>
      </VStack>

      <Formik initialValues={initial} onSubmit={send} validationSchema={schema}>
        {({handleChange, handleSubmit, values, errors, setFieldValue}) => (
          <Box w="90%">
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
            <Button
              isLoading={isLoading}
              rounded="lg"
              size="lg"
              marginTop={10}
              w="60%"
              bg="primary.500"
              alignSelf="center"
              onPress={handleSubmit}>
              SUBMIT
            </Button>
          </Box>
        )}
      </Formik>
    </Box>
  );
};

export default ForgotPassword;
