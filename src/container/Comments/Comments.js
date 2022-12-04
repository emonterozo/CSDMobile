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
} from 'native-base';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';

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

  const getComments = () => {
    getCommentsRequest(capstoneId)
      .then(res => setComments(res.comments))
      .catch(err => console.log(err));
  };

  useEffect(() => {
    getComments();
  }, []);

  const handlePressAddComment = () => {
    const payload = {
      comment,
      id: capstoneId,
      user: authenticatedUser._id,
    };
    addCommentRequest(payload, authenticatedUser.token)
      .then(() => {
        getComments();
        setComment('');
      })
      .catch(err => console.log(err));
  };

  return (
    <Box flex={1}>
      <AppBar title="Comments" />
      <FlatList
        data={comments}
        renderItem={({item}) => (
          <HStack alignItems="flex-start" space={2} p={2}>
            <Avatar bg="primary.300" _text={{color: 'black'}}>
              {item.user.first_name.substring(0, 1)}
            </Avatar>
            <VStack flex={1}>
              <Text
                bold>{`${item.user.first_name} ${item.user.last_name}`}</Text>
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
