import React from 'react';
import {Box, Text, HStack, Icon} from 'native-base';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {isEqual} from 'lodash';

const Toast = ({type, message}) => {
  return (
    <Box
      bg={isEqual(type, 'error') ? 'error.600' : 'success.600'}
      p={3}
      rounded="sm">
      <HStack alignItems="center" space={1}>
        <Icon
          as={MaterialCommunityIcons}
          name={isEqual(type, 'error') ? 'alert-circle' : 'check-circle'}
          color="white"
          size="md"
        />
        <Text fontSize="md" color="white" bold>
          {message}
        </Text>
      </HStack>
    </Box>
  );
};

export default Toast;
