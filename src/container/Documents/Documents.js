import React, {useContext, useState, useCallback, useEffect} from 'react';
import {
  Box,
  Button,
  HStack,
  Text,
  Icon,
  IconButton,
  Fab,
  Center,
  Spinner,
  useToast,
  CircleIcon,
} from 'native-base';
import {StyleSheet, Dimensions} from 'react-native';
import Pdf from 'react-native-pdf';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import DocumentPicker, {types} from 'react-native-document-picker';

import {AppBar, Toast} from '../../components';
import {capitalize, isEmpty, isEqual, isNull} from 'lodash';
import GlobalContext from '../../config/context';
import {
  getCapstoneRequest,
  updatePercentageRequest,
  uploadDocumentRequest,
} from '../../services/request';
import {STATUSES} from '../../utils/constant';

const Documents = ({route}) => {
  const {authenticatedUser} = useContext(GlobalContext);
  const {id} = route.params;
  const [documents, setDocuments] = useState([]);
  const [approver, setApprover] = useState('');
  const [owner, setOwner] = useState('');
  const [selectedDocument, setSelectedDocument] = useState({
    path: null,
    status: null,
  });
  const [title, setTitle] = useState('Documents');
  const [document, setDocument] = useState({
    totalPage: 0,
    currentPage: 1,
  });
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const getCapstone = () => {
    setIsLoading(true);
    getCapstoneRequest(id).then(res => {
      setOwner(res.capstone.uploaded_by._id);
      setDocuments(res.capstone.documents);
      setApprover(res.capstone.approver._id);
      setIsLoading(false);
    });
  };

  useEffect(() => {
    getCapstone();
  }, []);

  const handleDocumentSelection = useCallback(async key => {
    try {
      const response = await DocumentPicker.pick({
        presentationStyle: 'fullScreen',
        type: [types.pdf],
      });
      const formData = new FormData();
      formData.append('id', id);

      formData.append(key.toLowerCase(), {
        uri: response[0].uri,
        type: 'application/pdf',
        name: 'sample.pdf',
      });
      setIsLoading(true);
      uploadDocumentRequest(formData, authenticatedUser.token)
        .then(res => {
          toast.show({
            render: () => {
              return (
                <Toast
                  type="success"
                  message="Document uploaded successfully."
                />
              );
            },
          });
          setSelectedDocument({
            path: null,
            status: null,
          });
          setTitle('Documents');
          getCapstone();
        })
        .catch(() => {
          setIsLoading(false);
          toast.show({
            render: () => {
              return (
                <Toast
                  type="error"
                  message="Something went wrong please try again."
                />
              );
            },
          });
        });
    } catch (err) {
      console.warn(err);
    }
  }, []);

  const updateDocument = status => {
    setIsLoading(true);
    const payload = {
      id: id,
      chapter: title,
      status: status,
    };
    updatePercentageRequest(payload, authenticatedUser.token)
      .then(() => {
        setIsLoading(false);
        setSelectedDocument({
          path: null,
          status: null,
        });
        setTitle('Documents');
        getCapstone();
        toast.show({
          render: () => {
            return (
              <Toast
                type="success"
                message={`Document ${status} successfully.`}
              />
            );
          },
        });
      })
      .catch(() => {
        setIsLoading(false);
        toast.show({
          render: () => {
            return (
              <Toast
                type="error"
                message="Something went wrong please try again."
              />
            );
          },
        });
      });
  };

  return (
    <Box flex={1}>
      <AppBar
        title={title}
        isBackVisible={!isNull(selectedDocument.path)}
        handlePressBack={() => {
          setSelectedDocument({
            path: null,
            status: null,
          });
          setTitle('Documents');
        }}
        isButtonVisible={isEqual(authenticatedUser._id, approver) && !isLoading}
        isApproveVisible={
          isEqual(selectedDocument.status, 'declined') ||
          isEqual(selectedDocument.status, 'pending')
        }
        isDeclineVisible={
          isEqual(selectedDocument.status, 'approved') ||
          isEqual(selectedDocument.status, 'pending')
        }
        handlePressApproved={() => updateDocument('approved')}
        handlePressDeclined={() => updateDocument('declined')}
      />
      {isLoading ? (
        <Center flex={1}>
          <Spinner size="lg" color="primary.400" />
        </Center>
      ) : isNull(selectedDocument.path) ? (
        <Box flex={1} marginTop={30} marginX={5}>
          <HStack
            alignItems="center"
            justifyContent="center"
            flexWrap="wrap"
            space={3}
            marginY={3}>
            <HStack alignItems="center" space={1}>
              <CircleIcon color="yellow.500" />
              <Text>Pending</Text>
            </HStack>
            <HStack alignItems="center" space={1}>
              <CircleIcon color="green.500" />
              <Text>Approved</Text>
            </HStack>
            <HStack alignItems="center" space={1}>
              <CircleIcon color="red.500" />
              <Text>Declined</Text>
            </HStack>
            <HStack alignItems="center" space={1}>
              <CircleIcon color="gray.500" />
              <Text>Document Unavailable</Text>
            </HStack>
          </HStack>
          {documents.map((item, index) => (
            <Button
              key={item._id}
              marginY={1}
              leftIcon={
                <CircleIcon
                  color={
                    isEmpty(item.path) ? 'gray.500' : STATUSES[item.status]
                  }
                />
              }
              variant="outline"
              _text={{
                fontWeight: 'bold',
                color: 'primary.600',
              }}
              borderColor="primary.400"
              onPress={() => {
                setSelectedDocument({
                  path: item.path,
                  status: item.status,
                });
                setTitle(`Chapter ${index + 1}`);
              }}>
              {`Chapter ${index + 1}`}
            </Button>
          ))}
        </Box>
      ) : isEmpty(selectedDocument.path) ? (
        isEqual(authenticatedUser._id, owner) ? (
          <Box flex={1} alignItems="center" justifyContent="center">
            <IconButton
              icon={
                <Icon
                  as={MaterialCommunityIcons}
                  name="file-upload-outline"
                  size="6xl"
                  color="gray.500"
                />
              }
              onPress={() => handleDocumentSelection(title)}
            />
            <Text italic>Upload Document</Text>
          </Box>
        ) : (
          <Box flex={1} alignItems="center" justifyContent="center">
            <Icon
              as={MaterialCommunityIcons}
              name="alert-circle-outline"
              size="6xl"
              color="gray.500"
            />
            <Text italic>No Available Document</Text>
          </Box>
        )
      ) : (
        <Box flex={1}>
          <HStack alignItems="center" justifyContent="space-between">
            <HStack alignItems="center" p={1} space={1}>
              <Text fontSize="sm" bold>
                Status:
              </Text>
              <Text fontSize="sm" bold color="orange.500">
                {capitalize(selectedDocument.status)}
              </Text>
            </HStack>
            <Text fontSize="sm" bold p={1} alignSelf="flex-end">
              {`Page ${document.currentPage} of ${document.totalPage}`}
            </Text>
          </HStack>
          <Pdf
            trustAllCerts={false}
            source={{uri: selectedDocument.path}}
            onLoadComplete={(numberOfPages, filePath) => {
              setDocument({
                totalPage: numberOfPages,
                currentPage: 1,
              });
            }}
            onPageChanged={(page, numberOfPages) => {
              setDocument({
                ...document,
                currentPage: page,
              });
            }}
            onError={error => {
              console.log(error);
            }}
            onPressLink={uri => {
              console.log(`Link pressed: ${uri}`);
            }}
            style={styles.pdf}
          />
        </Box>
      )}
      {isEqual(owner, authenticatedUser._id) &&
        isEqual(selectedDocument.status, 'declined') &&
        !isLoading && (
          <Fab
            renderInPortal={false}
            shadow={2}
            bottom={20}
            size="md"
            bg="primary.500"
            onPress={() => handleDocumentSelection(title)}
            icon={
              <Icon
                color="white"
                as={MaterialCommunityIcons}
                name="file-upload-outline"
                size="md"
              />
            }
            label="Upload New"
          />
        )}
    </Box>
  );
};

const styles = StyleSheet.create({
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});

export default Documents;
