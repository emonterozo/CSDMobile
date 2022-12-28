import React, {useState, useCallback, useEffect, useContext} from 'react';
import {StyleSheet} from 'react-native';
import {
  Box,
  Button,
  FormControl,
  HStack,
  Input,
  Text,
  VStack,
  WarningOutlineIcon,
  ScrollView,
  Pressable,
  Image,
  useToast,
} from 'native-base';
import DropDownPicker from 'react-native-dropdown-picker';
import DocumentPicker, {types} from 'react-native-document-picker';
import ImagePicker from 'react-native-image-crop-picker';
import {Formik} from 'formik';
import * as Yup from 'yup';

import {AppBar, Toast} from '../../components';
import {isEmpty, isEqual} from 'lodash';
import {addCapstoneRequest, getTagsRequest} from '../../services/request';
import GlobalContext from '../../config/context';

const schema = Yup.object().shape({
  title: Yup.string().required('This field is required'),
  description: Yup.string().required('This field is required'),
  website: Yup.string().required('This field is required'),
  documents: Yup.array(
    Yup.object().shape({
      fileName: Yup.string(),
      path: Yup.string(),
    }),
  ),
  tags: Yup.array()
    .min(1, 'This field is required')
    .required('This field is required'),
});

const Capstone = () => {
  const {authenticatedUser} = useContext(GlobalContext);
  const toast = useToast();
  const [isTagPickerOpen, setIsTagPickerOpen] = useState(false);
  const [listOfTags, setListOfTags] = useState([]);
  const [isProfPickerOpen, setIsProfPickerOpen] = useState(false);
  const [listOfProfessor, setListOfProfessor] = useState([]);
  const [images, setImages] = useState(['', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);

  const initial = {
    title: '',
    description: '',
    website: '',
    documents: [
      {
        fileName: '',
        path: '',
      },
      {
        fileName: '',
        path: '',
      },
      {
        fileName: '',
        path: '',
      },
      {
        fileName: '',
        path: '',
      },
      {
        fileName: '',
        path: '',
      },
    ],
    tags: [],
  };

  const [imageError, setImageError] = useState('');

  const handleDocumentSelection = useCallback(
    async (setFieldValue, documents, index) => {
      try {
        const response = await DocumentPicker.pick({
          presentationStyle: 'fullScreen',
          type: [types.pdf],
        });
        const documentsHolder = documents.map((document, i) =>
          i === index
            ? {fileName: response[0].name, path: response[0].uri}
            : document,
        );
        setFieldValue('documents', documentsHolder);
      } catch (err) {
        console.warn(err);
      }
    },
    [],
  );

  useEffect(() => {
    getTagsRequest(authenticatedUser.token).then(res => {
      const tagsList = res?.tags.map(item => ({
        label: item.description,
        value: item._id,
      }));
      setListOfTags(tagsList);
    });
  }, []);

  const handlePressImage = index => {
    ImagePicker.openPicker({
      width: 700,
      height: 700,
      cropping: true,
    }).then(image => {
      setImageError('');
      const holder = [...images];
      holder[index] = image.path;
      setImages(holder);
    });
  };

  const addCapstone = (values, {resetForm}) => {
    setIsLoading(true);
    const imagesHolder = [...images];
    imagesHolder.shift();
    const holder = imagesHolder.filter(image => !isEmpty(image));
    const isLogoEmpty = isEmpty(images[0]);

    if (isLogoEmpty || holder.length <= 0) {
      setImageError('Logo/Images is required');
      setIsLoading(false);
    } else {
      const formData = new FormData();
      formData.append('title', values.title);
      formData.append('description', values.description);
      formData.append('website', values.website);
      values.tags.forEach(tag => {
        formData.append('tags', tag);
      });
      formData.append('professor', authenticatedUser.professor);
      formData.append('uploaded_by', authenticatedUser._id);
      values.documents.forEach((document, index) => {
        if (!isEmpty(document.path)) {
          formData.append(`chapter ${index + 1}`, {
            uri: document.path,
            type: 'application/pdf',
            name: `sample-${index}.pdf`,
          });
        }
      });
      formData.append('logo', {
        uri: images[0],
        type: 'image/png',
        name: 'sample.png',
      });
      holder.forEach(item => {
        formData.append('images', {
          uri: item,
          type: 'image/png',
          name: 'sample.png',
        });
      });
      addCapstoneRequest(formData, authenticatedUser.token)
        .then(() => {
          setIsLoading(false);
          toast.show({
            render: () => {
              return (
                <Toast
                  type="success"
                  message="Capstone have been successfully uploaded."
                />
              );
            },
          });
          setImages(['', '', '', '']);
          resetForm();
        })
        .catch(() => {
          toast.show({
            render: () => {
              return (
                <Toast
                  type="error"
                  message="Something went wrong. Please try again."
                />
              );
            },
          });
          setIsLoading(false);
        });
    }
  };

  return (
    <Box flex={1} justifyContent="center" alignItems="center">
      <AppBar title="Add Capstone" />
      <Box w="90%">
        <FormControl mt={3}>
          <FormControl.Label isRequired>Images</FormControl.Label>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            <HStack space={2}>
              {images.map((image, index) => (
                <Box
                  bg="white"
                  alignItems="center"
                  justifyContent="center"
                  borderColor="gray.300"
                  borderWidth={1}
                  borderRadius="sm"
                  width={150}
                  height={150}>
                  {isEmpty(image) ? (
                    <Button
                      variant="link"
                      _text={{
                        color: 'primary.500',
                        textDecorationLine: 'underline',
                      }}
                      onPress={() => handlePressImage(index)}>
                      {isEqual(index, 0) ? 'Add Logo' : 'Add Image'}
                    </Button>
                  ) : (
                    <Image
                      h={150}
                      w={150}
                      source={{
                        uri: image,
                      }}
                      alt="images"
                    />
                  )}
                </Box>
              ))}
            </HStack>
          </ScrollView>
          {!isEmpty(imageError) && (
            <HStack alignItems="center" space={1} ml={3} mt={2}>
              <WarningOutlineIcon size={3} color="error.600" />
              <Text fontSize="xs" color="error.600">
                {imageError}
              </Text>
            </HStack>
          )}
        </FormControl>
      </Box>

      <Formik
        initialValues={initial}
        onSubmit={addCapstone}
        validationSchema={schema}>
        {({handleChange, handleSubmit, values, errors, setFieldValue}) => (
          <ScrollView w="90%">
            <VStack>
              <FormControl isInvalid={'title' in errors}>
                <FormControl.Label isRequired>Title</FormControl.Label>
                <Input
                  variant="outline"
                  placeholder="Title"
                  bg="white"
                  borderColor="gray.300"
                  value={values.title}
                  onChangeText={handleChange('title')}
                />
                <FormControl.ErrorMessage
                  ml="3"
                  leftIcon={<WarningOutlineIcon size="xs" />}>
                  {errors.title}
                </FormControl.ErrorMessage>
              </FormControl>
              <FormControl isInvalid={'description' in errors}>
                <FormControl.Label isRequired>Description</FormControl.Label>
                <Input
                  variant="outline"
                  placeholder="Description"
                  bg="white"
                  borderColor="gray.300"
                  multiline
                  height={100}
                  value={values.description}
                  onChangeText={handleChange('description')}
                />
                <FormControl.ErrorMessage
                  ml="3"
                  leftIcon={<WarningOutlineIcon size="xs" />}>
                  {errors.description}
                </FormControl.ErrorMessage>
              </FormControl>
              <FormControl isInvalid={'website' in errors}>
                <FormControl.Label isRequired>Website</FormControl.Label>
                <Input
                  variant="outline"
                  placeholder="Website"
                  bg="white"
                  borderColor="gray.300"
                  value={values.website}
                  onChangeText={handleChange('website')}
                />
                <FormControl.ErrorMessage
                  ml="3"
                  leftIcon={<WarningOutlineIcon size="xs" />}>
                  {errors.website}
                </FormControl.ErrorMessage>
              </FormControl>
              <FormControl>
                <FormControl.Label isRequired>Tags</FormControl.Label>
                <DropDownPicker
                  multiple
                  open={isTagPickerOpen}
                  value={values.tags}
                  items={listOfTags}
                  setOpen={setIsTagPickerOpen}
                  onSelectItem={item => {
                    const holder = item.map(i => i.value);
                    setFieldValue('tags', holder);
                  }}
                  listMode="MODAL"
                  mode="BADGE"
                  setItems={setListOfTags}
                  searchable
                  placeholder="Select tags"
                  searchPlaceholder="Search tags"
                  showBadgeDot={false}
                  badgeTextStyle={styles.text}
                  badgeColors="#ffc97d"
                  style={styles.dropdown}
                  placeholderStyle={styles.placeholder}
                />
                {!isEmpty(errors.tags) && (
                  <HStack alignItems="center" space={1} ml={3} mt={2}>
                    <WarningOutlineIcon size={3} color="error.600" />
                    <Text fontSize="xs" color="error.600">
                      {errors.tags}
                    </Text>
                  </HStack>
                )}
              </FormControl>
              {values.documents.map((document, index) => (
                <FormControl>
                  <FormControl.Label>{`Chapter ${
                    index + 1
                  }`}</FormControl.Label>
                  <Box
                    flex={1}
                    h="45"
                    bg="white"
                    borderColor="gray.300"
                    borderWidth={1}
                    borderRadius="sm">
                    <HStack h="10" alignItems="center">
                      <Pressable
                        onPress={() =>
                          handleDocumentSelection(
                            setFieldValue,
                            values.documents,
                            index,
                          )
                        }>
                        <Box
                          alignItems="center"
                          justifyContent="center"
                          bg="primary.500"
                          m={2}
                          borderRadius="sm">
                          <Text paddingX={1} color="white">
                            Choose file
                          </Text>
                        </Box>
                      </Pressable>
                      <Text color="gray.600">
                        {isEmpty(values.documents[index].fileName)
                          ? 'No file chosen'
                          : values.documents[index].fileName}
                      </Text>
                    </HStack>
                  </Box>
                </FormControl>
              ))}
            </VStack>
            <Button
              isLoading={isLoading}
              rounded="lg"
              size="lg"
              marginY={6}
              w="60%"
              bg="primary.500"
              alignSelf="center"
              onPress={handleSubmit}>
              Add Capstone
            </Button>
          </ScrollView>
        )}
      </Formik>
    </Box>
  );
};

const styles = StyleSheet.create({
  dropdown: {
    borderWidth: 0.5,
    borderColor: '#d4d4d8',
    backgroundColor: 'white',
  },
  text: {
    color: 'black',
  },
  placeholder: {
    color: '#a1a1aa',
  },
  border: {
    borderColor: '#d4d4d8',
  },
});

export default Capstone;
