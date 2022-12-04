import React, {useContext, useEffect} from 'react';
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

const AuthStack = createStackNavigator();
const HomeStack = createStackNavigator();

const Navigation = () => {
  const {authenticatedUser, setAuthenticatedUser} = useContext(GlobalContext);

  useEffect(() => {
    getUser().then(user => {
      setAuthenticatedUser(user);
    });
  }, []);

  return (
    <NavigationContainer>
      {isNull(authenticatedUser) ? (
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
