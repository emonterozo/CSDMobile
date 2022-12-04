import React, {useState} from 'react';
import {Box, Text} from 'native-base';
import {StyleSheet, Dimensions} from 'react-native';
import Pdf from 'react-native-pdf';

import {AppBar} from '../../components';

const Documents = ({route}) => {
  const {documents} = route.params;
  const [document, setDocument] = useState({
    totalPage: 0,
    currentPage: 1,
  });
  return (
    <Box flex={1}>
      <AppBar title="Documents" />
      <Text fontSize="sm" bold p={1} alignSelf="flex-end">
        {`Page ${document.currentPage} of ${document.totalPage}`}
      </Text>
      <Pdf
        trustAllCerts={false}
        source={{uri: documents}}
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
