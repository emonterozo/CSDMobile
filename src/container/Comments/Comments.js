import React, {useState, useEffect, useContext} from 'react';
import {
  Box,
  Avatar,
  Text,
  HStack,
  VStack,
  FlatList,
  Input,
  Pressable,
  Icon,
  Center,
  Modal,
  Button,
} from 'native-base';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';
import {Rating} from 'react-native-ratings';

import {AppBar} from '../../components';
import {addCommentRequest, getCommentsRequest} from '../../services/request';
import GlobalContext from '../../config/context';
import {StyleSheet} from 'react-native';
import {isEqual} from 'lodash';
import {GUEST} from '../../utils/constant';

const Comments = ({route}) => {
  const {capstoneId} = route.params;
  const {authenticatedUser} = useContext(GlobalContext);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState('');
  const [selectedRating, setSelectedRating] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isFilterApplied, setIsFilterApplied] = useState(false);

  const getComments = rating => {
    getCommentsRequest(capstoneId, rating)
      .then(res => setComments(res.comments))
      .catch(err => console.log(err));
  };

  useEffect(() => {
    getComments(6);
  }, []);

  const handlePressAddComment = () => {
    const payload = {
      comment,
      id: capstoneId,
      user: authenticatedUser._id,
    };
    addCommentRequest(payload, authenticatedUser.token)
      .then(() => {
        getComments(6);
        setComment('');
        setIsFilterApplied(false);
        setSelectedRating(0);
      })
      .catch(err => console.log(err));
  };

  const handlePress = rating => {
    setIsModalVisible(false);
    setIsFilterApplied(!isEqual(rating, 6));
    getComments(rating);
    if (isEqual(rating, 6)) {
      setSelectedRating(0);
    }
  };

  return (
    <Box flex={1} bg="white">
      <AppBar
        title="Comments"
        isCommentFilterVisible
        isFilterApplied={isFilterApplied}
        handlePressFilter={() => setIsModalVisible(true)}
      />
      <Modal isOpen={isModalVisible} onClose={() => setIsModalVisible(false)}>
        <Modal.Content>
          <Modal.CloseButton />
          <Modal.Header>Filter Comments</Modal.Header>
          <Modal.Body>
            <Rating
              minValue={1}
              startingValue={selectedRating}
              ratingCount={5}
              imageSize={40}
              onFinishRating={rate => setSelectedRating(rate)}
            />
          </Modal.Body>
          <Modal.Footer>
            <VStack flex={1} space={1}>
              <Button
                w="full"
                bg="primary.500"
                onPress={() => handlePress(selectedRating)}>
                Apply Filter
              </Button>
              {isFilterApplied && (
                <Button variant="link" w="full" onPress={() => handlePress(6)}>
                  Remove Filter
                </Button>
              )}
            </VStack>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
      <FlatList
        data={comments}
        renderItem={({item}) => (
          <HStack alignItems="flex-start" space={2} p={2}>
            <Avatar bg="primary.300" _text={{color: 'black'}}>
              {item.user.first_name.substring(0, 1)}
            </Avatar>
            <VStack flex={1}>
              <HStack alignItems="center" space={2}>
                <Text
                  bold>{`${item.user.first_name} ${item.user.last_name}`}</Text>
                <Rating
                  startingValue={item.rate}
                  ratingCount={5}
                  imageSize={20}
                  showRating={false}
                  readonly
                />
              </HStack>
              <Text>{item.comment}</Text>
              <Text italic alignSelf="flex-end" fontWeight="medium">
                {moment(item.timestamp).format('MM/DD/YYYY hh:mm A')}
              </Text>
            </VStack>
          </HStack>
        )}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Center flexGrow={1}>
            <Text bold>No comments yet</Text>
          </Center>
        }
      />
      {!isEqual(authenticatedUser.type.description, GUEST) && (
        <Input
          value={comment}
          onChangeText={text => setComment(text)}
          InputRightElement={
            <Pressable onPress={handlePressAddComment}>
              <Icon
                as={<MaterialCommunityIcons name="send" />}
                size={5}
                mr="2"
                color="muted.400"
              />
            </Pressable>
          }
          placeholder="Write comment"
        />
      )}
    </Box>
  );
};

const styles = StyleSheet.create({
  list: {
    flexGrow: 1,
  },
});

export default Comments;
