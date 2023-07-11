import React, {useContext, useState, useEffect} from 'react';
import {StyleSheet, ImageBackground} from 'react-native';
import {
  HStack,
  Box,
  Icon,
  Text,
  AspectRatio,
  Image,
  Center,
  Stack,
  Heading,
  FlatList,
  Pressable,
  Fab,
  Spinner,
} from 'native-base';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useIsFocused} from '@react-navigation/native';

import {AppBar} from '../../components';
import GlobalContext from '../../config/context';
import {isEqual} from 'lodash';
import {GUEST, STUDENT} from '../../utils/constant';
import {
  getCapstonesAssignedRequest,
  getCapstonesOwnedRequest,
  getCapstonesRequest,
} from '../../services/request';
import {getRatings} from '../../utils/utils';

const Home = ({navigation}) => {
  const isFocused = useIsFocused();
  const {authenticatedUser} = useContext(GlobalContext);
  const [selected, setSelected] = useState(1);
  const [capstones, setCapstones] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    if (isEqual(selected, 1)) {
      getCapstonesRequest().then(res => {
        setIsLoading(false);
        setCapstones(res.capstones);
      });
    } else {
      if (isEqual(authenticatedUser?.type.description.toLowerCase(), STUDENT)) {
        getCapstonesOwnedRequest(authenticatedUser?._id).then(res => {
          setIsLoading(false);
          setCapstones(res.capstones);
        });
      } else {
        getCapstonesAssignedRequest(authenticatedUser?._id).then(res => {
          setIsLoading(false);
          setCapstones(res.capstones);
        });
      }
    }
  }, [isFocused, selected]);

  return (
    <Box flex={1}>
      <AppBar
        title="Home"
        isAccountVisible
        navigation={navigation}
        isProfileVisible={!isEqual(authenticatedUser?.type.description, GUEST)}
      />
      {isLoading ? (
        <Center flex={1}>
          <Spinner size="lg" color="primary.400" />
        </Center>
      ) : (
        <Box flex={1}>
          <ImageBackground
            source={require('../../assets/home.png')}
            resizeMode="cover"
            style={styles.image}>
            <FlatList
              data={capstones}
              numColumns={2}
              renderItem={({item}) => (
                <Box m="0.5" flex={1} maxWidth="50%">
                  <Pressable
                    onPress={() =>
                      navigation.navigate('Details', {
                        id: item._id,
                        capstone: item,
                      })
                    }>
                    <Box
                      h={200}
                      rounded="lg"
                      overflow="hidden"
                      borderColor="coolGray.300"
                      borderWidth="1">
                      <Box>
                        <AspectRatio w="100%" ratio={16 / 9}>
                          <Image
                            source={{
                              uri: item.logo,
                            }}
                            alt="image"
                          />
                        </AspectRatio>
                      </Box>
                      <Stack p="4" space={2}>
                        <Stack space={1}>
                          <Heading size="md" numberOfLines={2}>
                            {item.title}
                          </Heading>
                          <Text
                            fontSize="sm"
                            color="violet.500"
                            fontWeight="500"
                            ml="-0.5"
                            mt="-1">
                            {`${getRatings(item.ratings).ratings} stars`}
                          </Text>
                        </Stack>
                      </Stack>
                    </Box>
                  </Pressable>
                </Box>
              )}
              contentContainerStyle={styles.list}
              ListEmptyComponent={
                <Center flexGrow={1}>
                  <Text bold>No available data</Text>
                </Center>
              }
            />
          </ImageBackground>
        </Box>
      )}

      {!isEqual(authenticatedUser?.type.description, GUEST) && (
        <Box bg="white" width="100%" alignSelf="center">
          <HStack bg="#191919" alignItems="center" safeAreaBottom shadow={6}>
            <Pressable
              cursor="pointer"
              opacity={selected === 1 ? 1 : 0.5}
              py="3"
              flex={1}
              onPress={() => setSelected(1)}>
              <Center>
                <Icon
                  mb="1"
                  as={
                    <MaterialCommunityIcons
                      name={selected === 1 ? 'home' : 'home-outline'}
                    />
                  }
                  color="white"
                  size="sm"
                />
                <Text color="white" fontSize="12">
                  Home
                </Text>
              </Center>
            </Pressable>
            <Pressable
              cursor="pointer"
              opacity={selected === 2 ? 1 : 0.6}
              py="2"
              flex={1}
              onPress={() => setSelected(2)}>
              <Center>
                <Icon
                  mb="1"
                  as={
                    <MaterialCommunityIcons
                      name={selected === 2 ? 'view-list' : 'view-list-outline'}
                    />
                  }
                  color="white"
                  size="sm"
                />
                <Text color="white" fontSize="12">
                  {isEqual(
                    authenticatedUser?.type.description.toLowerCase(),
                    STUDENT,
                  )
                    ? 'My Capstone'
                    : 'Assigned'}
                </Text>
              </Center>
            </Pressable>
          </HStack>
        </Box>
      )}
      {isEqual(authenticatedUser?.type.description.toLowerCase(), STUDENT) &&
        isEqual(selected, 2) &&
        !capstones.length && (
          <Fab
            renderInPortal={false}
            shadow={2}
            bottom={20}
            size="md"
            bg="primary.500"
            onPress={() => {
              navigation.navigate('Capstone', {
                capstone: null,
                action: 'Add',
              });
            }}
            icon={
              <Icon
                color="white"
                as={MaterialCommunityIcons}
                name="plus"
                size="md"
              />
            }
          />
        )}
    </Box>
  );
};

const styles = StyleSheet.create({
  list: {
    flexGrow: 1,
  },
  image: {
    width: '100%',
    height: '100%',
  },
});

export default Home;
