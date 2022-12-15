import React, {useContext, useEffect, useState} from 'react';
import {Spinner, Center} from 'native-base';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {isNull} from 'lodash';

import {
  Login,
  Register,
  Home,
  Details,
  Capstone,
  Documents,
  Comments,
} from '../container';
import GlobalContext from '../config/context';
import {getUser} from '../utils/utils';
import {getLinkRequest} from '../services/request';

const AuthStack = createStackNavigator();
const HomeStack = createStackNavigator();

const Navigation = () => {
  const [isLoading, setIsLoading] = useState(true);
  const {authenticatedUser, setAuthenticatedUser, setLink} =
    useContext(GlobalContext);

  useEffect(() => {
    getLinkRequest().then(res => {
      setLink(res.links[0].link);
      getUser().then(user => {
        setAuthenticatedUser(user);
        setIsLoading(false);
      });
    });
  }, []);

  return (
    <NavigationContainer>
      {isLoading ? (
        <Center flex={1}>
          <Spinner size="lg" color="primary.400" />
        </Center>
      ) : isNull(authenticatedUser) ? (
        <AuthStack.Navigator screenOptions={{headerShown: false}}>
          <AuthStack.Screen name="Login" component={Login} />
          <AuthStack.Screen name="Register" component={Register} />
        </AuthStack.Navigator>
      ) : (
        <HomeStack.Navigator screenOptions={{headerShown: false}}>
          <HomeStack.Screen name="Home" component={Home} />
          <HomeStack.Screen name="Details" component={Details} />
          <HomeStack.Screen name="Capstone" component={Capstone} />
          <HomeStack.Screen name="Documents" component={Documents} />
          <HomeStack.Screen name="Comments" component={Comments} />
        </HomeStack.Navigator>
      )}
    </NavigationContainer>
  );
};

export default Navigation;
