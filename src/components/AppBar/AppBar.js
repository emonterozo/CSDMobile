import React, {useContext} from 'react';
import {StatusBar, HStack, Box, IconButton, Icon, Text} from 'native-base';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import GlobalContext from '../../config/context';
import {removeUser} from '../../utils/utils';

const AppBar = ({
  title,
  isLogoutVisible,
  isCommentVisible,
  handlePressComment,
}) => {
  const {setAuthenticatedUser} = useContext(GlobalContext);
  const handlePressLogout = () => {
    removeUser();
    setAuthenticatedUser(null);
  };

  return (
    <Box>
      <StatusBar bg="#e68300" barStyle="light-content" />
      <Box safeAreaTop bg="primary.500" />
      <HStack
        bg="primary.500"
        px="1"
        py="3"
        justifyContent="space-between"
        alignItems="center"
        w="100%">
        <HStack
          px="1"
          w="100%"
          alignItems="center"
          justifyContent="space-between">
          <Text color="white" fontSize="20" fontWeight="bold">
            {title}
          </Text>
          {isLogoutVisible && (
            <IconButton
              icon={
                <Icon
                  as={MaterialCommunityIcons}
                  name="logout"
                  size="md"
                  color="white"
                />
              }
              onPress={handlePressLogout}
            />
          )}
          {isCommentVisible && (
            <IconButton
              icon={
                <Icon
                  as={MaterialCommunityIcons}
                  name="comment-multiple"
                  size="md"
                  color="white"
                />
              }
              onPress={handlePressComment}
            />
          )}
        </HStack>
      </HStack>
    </Box>
  );
};

export default AppBar;
