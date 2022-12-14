import React, {useContext, useRef, useState, useEffect} from 'react';
import {Dimensions, Linking} from 'react-native';
import {
  Box,
  Text,
  Heading,
  AspectRatio,
  Image,
  Divider,
  Badge,
  HStack,
  ScrollView,
  VStack,
  Icon,
  IconButton,
  Button,
  Modal,
  Fab,
} from 'native-base';
import Carousel from 'react-native-snap-carousel';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Rating} from 'react-native-ratings';
import {useIsFocused} from '@react-navigation/native';

import {AppBar} from '../../components';
import {getRatings} from '../../utils/utils';
import GlobalContext from '../../config/context';
import {
  getCapstoneRequest,
  updateRatingRequest,
  updateViewsRequest,
} from '../../services/request';
import {isEqual, isNull} from 'lodash';
import {GUEST} from '../../utils/constant';

export const SLIDER_WIDTH = Dimensions.get('window').width + 30;
export const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.8);

const Details = ({navigation, route}) => {
  const isFocused = useIsFocused();
  const {authenticatedUser} = useContext(GlobalContext);
  const {id} = route.params;

  const isCarousel = useRef(null);
  const [isDescriptionModalVisible, setIsDescriptionModalVisible] =
    useState(false);
  const [isRateModalVisible, setIsRateModalVisible] = useState(false);
  const [rating, setRating] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [capstone, setCapstone] = useState(null);

  const getCapstone = () => {
    getCapstoneRequest(id).then(res => {
      const {ratings} = res.capstone;

      const rates = ratings.filter(item =>
        item.rate_by.some(i => i._id === authenticatedUser._id),
      );
      setRating(rates.length ? rates[0].rating : 1);
      setCapstone(res.capstone);
    });
  };

  useEffect(() => {
    getCapstone();
  }, [isFocused]);

  const handlePressSubmitRating = () => {
    setIsLoading(true);
    const payload = {
      rating,
      id: capstone._id,
      user: authenticatedUser._id,
    };
    updateRatingRequest(payload, authenticatedUser.token)
      .then(() => {
        setIsRateModalVisible(false);
        setIsLoading(false);
        getCapstone();
      })
      .catch(() => setIsRateModalVisible(false));
  };

  const handlePressWebsite = () => {
    if (
      !isEqual(capstone.uploaded_by._id, authenticatedUser._id) &&
      !isEqual(authenticatedUser.type.description, GUEST)
    ) {
      updateViewsRequest({id: capstone._id}, authenticatedUser.token)
        .then(res => console.log(res))
        .catch(err => console.log(err));
    }
    Linking.openURL(capstone.website);
  };

  return (
    <Box flex={1}>
      <AppBar
        title="Details"
        isCommentVisible
        handlePressComment={() =>
          navigation.navigate('Comments', {capstoneId: capstone._id})
        }
      />
      <Modal
        isOpen={isDescriptionModalVisible}
        onClose={() => setIsDescriptionModalVisible(false)}>
        <Modal.Content>
          <Modal.CloseButton />
          <Modal.Header>Description</Modal.Header>
          <Modal.Body>
            <Text fontWeight="400">{capstone?.description}</Text>
          </Modal.Body>
        </Modal.Content>
      </Modal>
      <Modal
        isOpen={isRateModalVisible}
        onClose={() => setIsRateModalVisible(false)}>
        <Modal.Content>
          <Modal.CloseButton />
          <Modal.Header>Rate</Modal.Header>
          <Modal.Body>
            <Rating
              minValue={1}
              startingValue={rating}
              ratingCount={5}
              imageSize={40}
              showRating
              onFinishRating={rate => setRating(rate)}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button
              isLoading={isLoading}
              w="full"
              bg="primary.500"
              onPress={handlePressSubmitRating}>
              Submit
            </Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
      {!isNull(capstone) && (
        <>
          <Box bg="white">
            <HStack m={2} alignItems="center" space={2}>
              <VStack alignItems="center">
                <Heading>{getRatings(capstone.ratings).ratings}</Heading>
                <Text>{`${
                  getRatings(capstone.ratings).totalReviews
                } reviews`}</Text>
              </VStack>
              <Rating
                startingValue={getRatings(capstone.ratings).ratings}
                ratingCount={5}
                imageSize={40}
                showRating={false}
                readonly
              />
            </HStack>
          </Box>
          <Divider />
          <Box my={2} alignItems="center">
            <Carousel
              ref={isCarousel}
              data={[capstone?.logo, ...capstone?.images]}
              renderItem={({item}) => (
                <Box>
                  <AspectRatio w="100%">
                    <Image
                      source={{
                        uri: item,
                      }}
                      alt="images"
                    />
                  </AspectRatio>
                </Box>
              )}
              sliderWidth={SLIDER_WIDTH}
              itemWidth={ITEM_WIDTH}
            />
          </Box>
          <Divider />
          <ScrollView>
            <Box>
              <Heading size="sm" fontWeight="800" px={2} marginTop={2}>
                {capstone?.title}
              </Heading>
              <VStack mx={2} space={1}>
                <Box>
                  <HStack alignItems="center" justifyContent="space-between">
                    <Heading size="sm" fontWeight="600">
                      Description
                    </Heading>
                    <IconButton
                      icon={
                        <Icon
                          as={MaterialCommunityIcons}
                          name="arrow-right"
                          size="xl"
                          color="black"
                        />
                      }
                      onPress={() => setIsDescriptionModalVisible(true)}
                    />
                  </HStack>
                  <Text numberOfLines={3} fontWeight="400">
                    {capstone?.description}
                  </Text>
                </Box>
                <Divider />
                {isEqual(authenticatedUser?._id, capstone?.uploaded_by._id) ||
                isEqual(authenticatedUser?._id, capstone?.approver._id) ? (
                  <Box>
                    <HStack alignItems="center">
                      <Heading size="sm" fontWeight="600">
                        Documents
                      </Heading>
                      <Button
                        variant="link"
                        onPress={() => {
                          navigation.navigate('Documents', {
                            id: capstone?._id,
                          });
                        }}>
                        View documents
                      </Button>
                    </HStack>
                  </Box>
                ) : null}
                <Box>
                  <HStack alignItems="center">
                    <Heading size="sm" fontWeight="600">
                      Website
                    </Heading>
                    <Button variant="link" onPress={handlePressWebsite}>
                      View website
                    </Button>
                  </HStack>
                </Box>
                <Divider />
                <Box>
                  <Heading size="sm" fontWeight="600">
                    Tags
                  </Heading>
                  <HStack flexWrap="wrap" justifyContent="center" space="2">
                    {capstone?.tags.map(tag => (
                      <Badge
                        rounded="full"
                        m="1"
                        _text={{fontWeight: 'bold', color: 'cyan.900'}}
                        colorScheme="primary">
                        {tag.description}
                      </Badge>
                    ))}
                  </HStack>
                </Box>
                <Divider />
              </VStack>
              <VStack m={2} space={1}>
                {!isEqual(authenticatedUser._id, capstone?.uploaded_by._id) &&
                  !isEqual(authenticatedUser.type.description, GUEST) && (
                    <Button
                      bg="primary.500"
                      onPress={() => setIsRateModalVisible(true)}>
                      Rate
                    </Button>
                  )}
              </VStack>
              <Box mx={2} mb={2} alignItems="flex-end">
                <Text
                  bold>{`Uploaded by ${capstone?.uploaded_by.first_name} ${capstone?.uploaded_by.last_name}`}</Text>
              </Box>
            </Box>
          </ScrollView>
          {isEqual(capstone?.uploaded_by._id, authenticatedUser._id) && (
            <Fab
              renderInPortal={false}
              shadow={2}
              bottom={20}
              size="md"
              bg="primary.500"
              onPress={() => {
                const images = [capstone.logo, ...capstone.images];
                for (let i = 0; i < 3 - capstone.images.length; i++) {
                  images.push('');
                }
                const tags = capstone.tags.map(tag => tag._id);
                navigation.navigate('Capstone', {
                  capstone: {
                    ...capstone,
                    tags: tags,
                    imagesHolder: images,
                  },
                  action: 'Update',
                });
              }}
              icon={
                <Icon
                  color="white"
                  as={MaterialCommunityIcons}
                  name="file-document-edit-outline"
                  size="md"
                />
              }
            />
          )}
        </>
      )}
    </Box>
  );
};

export default Details;
