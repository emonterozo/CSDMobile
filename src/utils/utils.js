import AsyncStorage from '@react-native-async-storage/async-storage';
import {isEqual, round} from 'lodash';

import {ASYNC_STORAGE_KEY_USER} from './constant';

// Will save user data into async storage
export const setUser = async data => {
  try {
    const jsonValue = JSON.stringify(data);
    await AsyncStorage.setItem(ASYNC_STORAGE_KEY_USER, jsonValue);
  } catch (error) {
    return error;
  }
};

// Will get user data from async storage
export const getUser = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(ASYNC_STORAGE_KEY_USER);
    return jsonValue !== null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    return error;
  }
};

//  Will remove user data from async storage
export const removeUser = async () => {
  try {
    return await AsyncStorage.removeItem(ASYNC_STORAGE_KEY_USER);
  } catch (error) {
    return error;
  }
};

export const getRatings = ratings => {
  const five = ratings
    .filter(item => isEqual(item.rating, 5))
    .map(item => item.count);
  const four = ratings
    .filter(item => isEqual(item.rating, 4))
    .map(item => item.count);
  const three = ratings
    .filter(item => isEqual(item.rating, 3))
    .map(item => item.count);
  const two = ratings
    .filter(item => isEqual(item.rating, 2))
    .map(item => item.count);
  const one = ratings
    .filter(item => isEqual(item.rating, 1))
    .map(item => item.count);

  const rate =
    (5 * five[0] + 4 * four[0] + 3 * three[0] + 2 * two[0] + 1 * one[0]) /
    (five[0] + four[0] + three[0] + two[0] + one[0]);

  return {
    ratings: round(rate, 1) || 0,
    totalReviews: five[0] + four[0] + three[0] + two[0] + one[0],
  };
};

export const isUrl = s => {
  const regexp =
    /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
  return regexp.test(s);
};
