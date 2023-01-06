import React, {useContext} from 'react';
import {
  StatusBar,
  HStack,
  Box,
  IconButton,
  Icon,
  Text,
  Button,
  Menu,
} from 'native-base';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {removeUser} from '../../utils/utils';
import GlobalContext from '../../config/context';

const AppBar = ({
  title,
  isAccountVisible,
  isCommentVisible,
  handlePressComment,
  isBackVisible,
  handlePressBack,
  isButtonVisible,
  isDeclineVisible,
  isApproveVisible,
  handlePressDeclined,
  handlePressApproved,
  navigation,
}) => {
  const {setAuthenticatedUser} = useContext(GlobalContext);
  const handlePressAccount = () => {
    navigation.navigate('Account');
  };

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
          <HStack alignItems="center">
            {isBackVisible && (
              <IconButton
                icon={
                  <Icon
                    as={MaterialCommunityIcons}
                    name="arrow-left"
                    size="md"
                    color="white"
                  />
                }
                onPress={handlePressBack}
              />
            )}
            <Text color="white" fontSize="20" fontWeight="bold">
              {title}
            </Text>
          </HStack>
          {isButtonVisible && (
            <HStack>
              {isApproveVisible && (
                <Button
                  variant="ghost"
                  _text={{
                    color: 'white',
                    fontWeight: 'bold',
                    textDecorationLine: 'underline',
                  }}
                  onPress={handlePressApproved}>
                  APPROVE
                </Button>
              )}
              {isDeclineVisible && (
                <Button
                  variant="ghost"
                  _text={{
                    color: 'white',
                    fontWeight: 'bold',
                    textDecorationLine: 'underline',
                  }}
                  onPress={handlePressDeclined}>
                  DECLINE
                </Button>
              )}
            </HStack>
          )}
          {isAccountVisible && (
            <Menu
              w="190"
              trigger={triggerProps => {
                return (
                  <IconButton
                    icon={
                      <Icon
                        as={MaterialCommunityIcons}
                        name="account-circle"
                        size="lg"
                        color="white"
                      />
                    }
                    {...triggerProps}
                  />
                );
              }}>
              <Menu.Item onPress={handlePressAccount}>Account</Menu.Item>
              <Menu.Item onPress={handlePressLogout}>Logout</Menu.Item>
            </Menu>
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
