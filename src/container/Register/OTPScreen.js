import React, {useState} from 'react';
import {StyleSheet} from 'react-native';
import {Box, Button, Heading, Text, VStack, useToast} from 'native-base';
import OTPInputView from '@twotalltotems/react-native-otp-input';

import {resendOTPRequest, verifyOTPRequest} from '../../services/request';
import {isNull} from 'lodash';

import {Toast} from '../../components';

const OTPScreen = ({navigation, route}) => {
  const [error, setError] = useState('');
  const toast = useToast();

  const handlePressResendOTP = () => {
    resendOTPRequest(route.params)
      .then(res => console.log(res))
      .catch(err => console.log(err));
  };

  const handleVerifyOTP = code => {
    const payload = {
      otp: code,
      email: route.params.email,
    };
    verifyOTPRequest(payload)
      .then(res => {
        if (isNull(res.error)) {
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
          navigation.goBack();
        } else {
          setError(res.error);
        }
      })
      .catch(err => console.log(err));
  };

  return (
    <Box flex={1} justifyContent="center" alignItems="center">
      <VStack marginY={10} w="90%" space={1}>
        <Heading color="muted.800">Email Verification!</Heading>
        <Text color="muted.400">Input OTP sent to your email to continue</Text>
      </VStack>
      <Text mb={2} color="error.500">
        {error}
      </Text>
      <OTPInputView
        style={styles.container}
        keyboardType="number-pad"
        pinCount={6}
        autoFocusOnLoad
        codeInputFieldStyle={styles.underlineStyleBase}
        codeInputHighlightStyle={styles.underlineStyleHighLighted}
        onCodeFilled={handleVerifyOTP}
      />
      <Button
        rounded="lg"
        size="md"
        marginTop={10}
        w="40%"
        bg="primary.500"
        onPress={handlePressResendOTP}>
        Resend OTP
      </Button>
    </Box>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '80%',
    height: 50,
    alignItems: 'center',
  },
  underlineStyleBase: {
    width: 50,
    height: 50,
    borderWidth: 2,
    borderColor: 'gray',
    color: 'blue',
  },
  underlineStyleHighLighted: {
    borderColor: '#03DAC6',
  },
});

export default OTPScreen;
